import { Observable } from 'rxjs';

export interface IAddress {
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export enum FieldTypeEnum {
  date = 'date',
  email = 'email',
  phone = 'phone',
  checkbox = 'checkbox',
  string = 'string',
  Input = 'Input',
  ArrayInput = 'ArrayInput',
  Address = 'Address',
  Textarea = 'Textarea',
  ngSelect = 'ngSelect',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  SimpleCheckBox = 'SimpleCheckBox',
  WYSIWYG = 'Wysiwyg',
// ngInputGroup = 'ng-input-group',
}

export enum TypeAttributeEnum {
  Phone = 'Phone',
  URL = 'URL',
  Date = 'Date',
  Currency = 'Currency',
  InsuranceBIN = 'InsuranceBIN',
  Email = 'Email',
  Password = 'Password',
  Number = 'Number',
  NameForSlug = 'NameForSlug',
}

export interface IField {
  _id?: string;
  name: string;
  label?: string;
  notes?: string;
  type: FieldTypeEnum | string;
  required?: boolean;
  disabled?: boolean;
  typeAttribute?: TypeAttributeEnum | string;
  originallyHidden?: boolean;
  shouldShow?: boolean;
  hasAccess?: boolean;
  subField?: boolean;
  options?: any[]; //todo
  minChecked?: number;
  maxChecked?: number;
  typeFilters?: any;
  referenceId?: any;
  allowOther?: boolean;
  shouldChange?: boolean;
  active?: boolean;
  pickerType?: string;

	ngSelectBindLabel?: string;
	ngEditable?: boolean;
	ngPopUpComponent?: any;
	ngPopUpService?: any;
	ngPopUpStructure?: IField[];
  ngPopUpDefaultValue?: { [key: string]: any };
  ngPopUpTitle?: any;
  clearable?: boolean;
}


export interface IUser {
  active?: boolean;
  callCenters?: any[];
  company?: string;
  createdAt?: Date;
  email?: string;
  fullname?: string;
  hashedPassword?: string;
  lastLogin?: Date;
  loginLogs?: string[];
  mfaKey?: string;
  password?: string;
  permissions?: any[];
  profileImage?: {
    key?: string;
    url?: string;
  };
  repeatPassword?: string;
  roles?: {
    companies?: any[];
    createdAt?: string;
    description?: string;
    name?: string;
    permissions?: {
      canCreate?: boolean;
      canDelete?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      permission?: string;
      _id?: string;
    };
    reports?: any[]
    saleStatuses?: any[]
    slug?: string;
    _id?: string;
  }[];
  selectedCompany?: string;
  selectedPartner?: string;
  settings?: {
    companies?: {
      [key: string]: {
        defaultPartner?: string;
      }
    };
    defaultCompany?: string;
  };
  verbalWarnings?: {
    author?: {
      _id: string;
      fullname: string;
    }
    created?: Date;
    reason?: string;
  }[];
  _id?: string;
}

export interface IOffice {
  name: string;
  active?: boolean;
  _id?: string;
}

export interface ILab {
  name: string;
  active?: boolean;
  _id?: string;
}

export interface INdc {
  name: string;
  active?: boolean;
  _id?: string;
}

export interface IForm {
  name?: string;
  active?: boolean;
  _id?: string;
  pages?: any[];
  $pull?: { [key: string]: any };
  $push?: { [key: string]: any };
}

export interface IPage {
  name?: string;
  active?: boolean;
  _id?: string;
  pages?: any[];
  $pull?: { [key: string]: any };
  $push?: { [key: string]: any };
}

export interface IStatus {
  name?: string;
  agentName?: string;
  sorting?: number;
  active?: boolean;
  _id?: string;
}

export interface IRole {
  name?: string;
  slug?: string;
  companies?: string[];
  reports?: string[];
  imports?: string[];
  permissions?: IPermission[];
  saleStatuses?: {}[];
  _id?: string;
}

export interface IProduct {
	name?: string;
	callCenters?: string[];
	active?: boolean;
	images?: { url: string }[];
	dosageType?: string[];
	_id?: string;
}

export interface IDosageType {
	name?: string;
	active?: boolean;
	_id?: string;
}

export interface IproductGroup {
	name?: string;
	active?: boolean;
	_id?: string;
}

export interface ICallCenter {
  _id?: string;
  name: string;
  contacts?: string[];
  address?: IAddress;
  active?: boolean;
}

export interface ICompany {
  _id?: string;
  name: string;
  contacts?: string[];
  address?: IAddress;
  active?: boolean;
}

export interface IPartner {
  _id?: string;
  name: string;
  contacts?: string[];
  address?: IAddress;
  active?: boolean;
}

export interface IPhysician {
  _id?: string;
  name?: string;
  contacts?: string[];
  address?: IAddress;
  active?: boolean;
  scriptPad?: { url: string };
  scriptPadXValue?: boolean;
  refillAmount?: number;
}

export interface ICheckLIst {
  _id?: string;
  name: string;
  items?: {}[];
  contacts?: string[];
  address?: IAddress;
  active?: boolean;
}

export interface IClinic {
  name: string;
  active?: boolean;
  _id?: string;
}

export interface IPharmacy {
  name?: string;
	address?: IAddress;
  active?: boolean;
  _id?: string;
}

export interface IPbm {
  name: string;
  binNumbers?: boolean;
  _id?: string;
}

export interface IPermission {
  name?: string;
  subject?: string;
  permission?: string;
  description?: string;
  _id?: string;
}

export interface IProductCode {
  name?: string;
  productCodeType?: string;
  product?: string;
  unitQty?: number;
  costOfGoods?: number;
  active: boolean;
  _id?: string;
}

export interface ITeam {
  name?: string;
  leader?: string;
  members: string[];
  active?: boolean;
  _id?: string;
}

export interface IBalanceCounter {
  pharmacyId: string;
  physician: { _id: string };
  pbmId: string;
}

export interface IService<T> {
  get$?: () => Observable<T[]>;
  getById$?: (string) => Observable<T>;
  save$: (T) => Observable<T>;
  delete$?: (T) => Observable<null>;
}

export interface ICrudParams {
  path: string;
  subjectType?: string; // used for popup messages that tell what was updated
}

export interface IGetParams extends ICrudParams {
  params?: any;
  isFile?: boolean;
}

export interface IPostParams extends ICrudParams {
  body?: any;
  isFile?: boolean;
  customToken?: string;
}

export interface IPutParams extends ICrudParams {
  body?: any;
  isFile?: boolean;
}

export interface IDeleteParams extends ICrudParams {
  id?: string | number;
}

export interface INote {
	referenceToType: string;
	referenceTo: string;
	text: string;
	type: string;
	createdAt: Date | number;
	author: IUser;
}

export interface IPatient {
  _id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: {
    mobile: string;
    home: string;
  };
  email: string;
  dateOfBirth: string;
  gender: string;
  insurances: any[];
  createdAt: string;
}