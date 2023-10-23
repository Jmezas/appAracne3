import { TemplateRef } from "@angular/core"

export interface ISelectGeneric {
    id: string,
    value: string,
    mapperData?: any
}

export interface IListSelectGeneric {
    id: string,
    value: string,
    subTitle: string,
    subTitle2?: string,
    image?: string,
    configIcon?: {color: string, icon: string},
    mapperData?: any
}
export interface IItemHeaderIcon {
    type: string,
    icon: string,
    template: string | TemplateRef<any>
}