export interface IBodyToast {
  message: string;
  type?: string;
  icon?: string;
}

export const TYPE_TOAST =  {success: "success", warning:  "warning", danger: 'danger', dark: 'dark'}