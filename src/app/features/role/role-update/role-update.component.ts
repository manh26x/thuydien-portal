import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {RoleService} from '../../../shared/service/role.service';
import {concatMap, delay, finalize, map, mergeMap, startWith, takeUntil, tap} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {TabView} from 'primeng/tabview';
import {AppTranslateService} from '../../../core/service/translate.service';
import {FeatureService} from '../../../shared/service/feature.service';
import {FeatureMenu} from '../model/feature';
import {UtilService} from '../../../core/service/util.service';
import {BaseComponent} from '../../../core/base.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role, RoleDetail, RoleEnum, RoleFeature, RoleTag} from '../../../shared/model/role';
import {Message, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {BeforeLeave} from '../../../core/model/before-leave';

@Component({
  selector: 'aw-role-update',
  templateUrl: './role-update.component.html',
  styles: [
  ]
})
export class RoleUpdateComponent extends BaseComponent implements OnInit, AfterViewInit, BeforeLeave {

  roleForm: FormGroup;
  @ViewChild('tabView') tabView: TabView;
  featureList: FeatureMenu[] = [];
  isLoadedTag = false;
  isLoadedFeature = false;
  msg: Message[] = [];
  roleInfo: RoleDetail = {};
  isLeave = false;
  constructor(
    private roleService: RoleService,
    private indicator: IndicatorService,
    private appTranslate: AppTranslateService,
    private featureService: FeatureService,
    private util: UtilService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.roleService.setPage('update');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.roleService.getRoleDetail(id).pipe(
        takeUntil(this.nextOnDestroy),
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.roleInfo = res;
      this.roleForm.patchValue({
        code: res.roleInfo.id,
        status: res.roleInfo.status,
        name: res.roleInfo.name,
        desc: res.roleInfo.description,
        isAdminPortal: res.roleInfo.portalActive === 1,
        isMobileApp: res.roleInfo.mobileActive === 1
      });
    });

  }

  ngAfterViewInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      delay(100),
      takeUntil(this.nextOnDestroy)
    ).subscribe(_ => {
      this.tabView.cd.markForCheck();
    });
  }

  doSave() {
    if (this.roleForm.invalid) {
      this.util.validateAllFields(this.roleForm);
    } else {
      const value = this.roleForm.getRawValue();
      const roleData: Role = {
        id: value.code,
        name: value.name,
        description: value.desc,
        status: value.status,
        mobileActive: value.isMobileApp ? 1 : 0,
        portalActive: value.isAdminPortal ? 1 : 0
      };

      let featureData: RoleFeature[] = [];


      if (this.isLoadedFeature) {
        this.featureList.forEach(item => {
          if (item.isDelAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_DELETE });
          }

          if (item.isAddAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_INSERT });
          }

          if (item.isEditAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_EDIT });
          }
          if (item.isApproveAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_APPROVE });
          }

          if (item.isOnOffAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_ON_OFF });
          }

          if (item.isViewAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_VIEW });
          }

          if (item.isImportAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_IMPORT });
          }

          if (item.isExportAble) {
            featureData.push({ menuId: item.menuId, rightId: RoleEnum.ACTION_EXPORT });
          }
        });
      } else {
        featureData = this.roleInfo.menuRightList;
      }

      if (value.isAdminPortal && featureData.length === 0) {
        this.messageService.add({ key: 'update-role', severity: 'error', detail: this.translate.instant('invalid.requiredFeature') });
        return;
      }

      this.indicator.showActivityIndicator();
      this.roleService.updateRole({
        menuRightList: featureData,
        roleInfo: roleData
      }).pipe(
        concatMap(() => this.roleService.getUserRole()),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe((userRole) => {
        if (userRole.listRole.find(role => role.roleId === value.code)) {
          this.roleService.changeRoleOfUser(userRole);
        }
        this.isLeave = true;
        this.messageService.add({
          severity: 'success',
          detail: this.translate.instant('message.updateSuccess')
        });
        this.router.navigate(['role']);
      }, err => {
        if (err instanceof ApiErrorResponse && err.code === '201') {
          this.messageService.add({
            severity: 'error',
            detail: this.translate.instant('message.notFound')
          });
        } else if (err instanceof ApiErrorResponse && err.code === '205') {
          this.messageService.add({
            severity: 'error',
            detail: this.translate.instant('message.notPermission')
          });
        } else {
          throw err;
        }
      });
    }
  }

  doCancel() {
    this.router.navigate(['role']);
  }

  doChangeTab(evt: any) {
    switch (evt.index) {
      case 1: {
        if (!this.isLoadedFeature) {
          this.getFeature();
        }
      }
    }
  }


  getFeature() {
    this.indicator.showActivityIndicator();
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      takeUntil(this.nextOnDestroy),
      tap(() => this.indicator.showActivityIndicator()),
      mergeMap(() => this.appTranslate.getTranslationAsync('menu').pipe(
        map(res => res),
        concatMap(lang => this.featureService.getAllMenu().pipe(
          map(res => {
            const featureData: FeatureMenu[] = [];
            if (this.util.canForEach(res)) {
              res.forEach(item => {
                featureData.push({
                  ...item,
                  translatedName: lang[item.menuName],
                  canAdd: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_INSERT),
                  canDel: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_DELETE),
                  canEdit: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_EDIT),
                  canOnOff: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_ON_OFF),
                  canView: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_VIEW),
                  canImport: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_IMPORT),
                  canApprove: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_APPROVE),
                  canExport: !!item.listRight.find(action => action.rightId === RoleEnum.ACTION_EXPORT),
                  isViewAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_VIEW),
                  isOnOffAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_ON_OFF),
                  isEditAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_EDIT),
                  isAddAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_INSERT),
                  isDelAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_DELETE),
                  isImportAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_IMPORT),
                  isExportAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_EXPORT),
                  isApproveAble: this.isRoleActive(item.menuId, RoleEnum.ACTION_APPROVE),
                });
              });
            }
            return featureData;
          })
        ))
      ))
    ).subscribe(res => {
      this.indicator.hideActivityIndicator();
      this.tabView.cd.markForCheck();
      this.isLoadedFeature = true;
      this.featureList = res;
    }, err => {
      this.indicator.hideActivityIndicator();
      throw err;
    });
  }

  isRoleActive(menuId: string, action: any): boolean {
    return !!this.roleInfo.menuRightList.find(menu => (menu.menuId === menuId && menu.rightId === action));
  }

  initForm() {
    this.roleForm = this.fb.group({
      code: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(100)]],
      status: [{value: RoleEnum.STATUS_ACTIVE}, [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(500)]],
      desc: ['', [Validators.required, Validators.maxLength(1000)]],
      isAdminPortal: [false],
      isMobileApp: [false]
    }, { validators: this.roleService.clientMatcher, updateOn: 'blur' });
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
