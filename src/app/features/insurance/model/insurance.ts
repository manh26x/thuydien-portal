export enum InsuranceConst {
  ALL= null
}
export class DropdownObject {
  code: string;
  label: string;
}
export enum DropdownOptionsList {

  // @ts-ignore
  statusList= [{code: 'C', label: 'Có'}, {code: 'K', label: 'Không'}],
  // @ts-ignore
targetList = [
    {code: 'mdsdn', label: 'Xe chở người'},
    {code: 'mdsdh', label: 'Xe chở hàng'},
    {code: 'mdsdt', label: 'Xe chở người và hàng'}
  ],
  // @ts-ignore
  peopleList= [
        {code: 'xen1', label: 'Xe không kinh doanh'},
        {code: 'xen2', label: 'Xe chạy trong khu nội bộ'},
        {code: 'xen3', label: 'Xe khách liên tỉnh'},
        {code: 'xen4', label: 'Xe bus'},
        {code: 'xen5', label: 'Xe grap và loại hình tương tự'},
        {code: 'xen6', label: 'Xe taxi'},
        {code: 'xen7', label: 'Xe tập lái'},
        {code: 'xen8', label: 'Xe cứu thương'},
        {code: 'xen10', label: 'Xe kinh doanh khác'}],
  // @ts-ignore
      goodsList= [
        {code: 'xeh1', label: 'Xe rơ mooc'},
        {code: 'xeh2', label: 'Xe tải trên 10 tấn'},
        {code: 'xeh3', label: 'Xe đầu kéo, xe đông lạnh trên 3.5 tấn'},
        {code: 'xeh4', label: 'Xe kinh doanh vận tải hàng hóa'},
        {code: 'xeh5', label: 'Xe trong vùng khoáng sản'},
        {code: 'xeh6', label: 'Xe chở hàng còn lại'},
        {code: 'xeh7', label: 'Xe rở mooc ben'},
        {code: 'xeh8', label: 'Xe chở tiền'}
      ],
  // @ts-ignore
      otherList= [
        {code: 'xet1', label: 'Xe bán tải'},
        {code: 'xet2', label: 'Xe chở hàng còn lại'}
      ],
  // @ts-ignore
  customerTypeList= [{code: 'C', label: 'Cá nhân'}, {code: 'K', label: 'Tổ chức'}],
}
