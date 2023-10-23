export const getRouteImageExhibition = (campaignName: string, filename: string) => {
    const  route = "https://aracne.salesland.net/assets/images/UploadImg/" + campaignName + "/" + filename;
    return filename == null ? filename : route;
}

export const getPhotoName = (photoUri: string) => {
    return photoUri.split('/');
}