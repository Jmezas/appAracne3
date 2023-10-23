import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { ProductoCampanaModel } from 'src/app/shared/models/database-model/productCampania.model';

const TABLE_DB = 'ProductosCampana';
@Injectable({
  providedIn: 'root'
})
export class ProductosCampanaDao {
  constructor() {}

  createTable (dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS ${TABLE_DB}`+
    "('IdProducto' TEXT NOT NULL, "+
    "'SubFamilia' TEXT, "+
    "'FamSubFamProducto' TEXT, "+
    "'Producto' TEXT, "+
    "'IdCampana' TEXT, "+
    "'Activo' TEXT, "+
    "'FamiliaProducto' TEXT, "+
    "'ReporteVisibilidad' TEXT, "+
    "'IdSubFamiliaProducto' TEXT, "+
    "'IdLineaNegocio' TEXT, "+
    "'UnidadNegocio' TEXT, "+
    "PRIMARY KEY('IdProducto'));";

    dbObject
    .executeSql(Query, [])
    .then((response) => {
        console.log('DB : Tabla ProductosCampana creada correctamente : ', response);
        return true;
    })
    .catch((error) => {
        console.log('DB ERROR : Tabla ProductosCampana no se creo : ', JSON.stringify(error));
        return false;
    });
  }

  async findByCampaignReport (campaniaId: string, IdLineaNegocio: string, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE IdCampana = ${campaniaId} AND IdLineaNegocio = ${IdLineaNegocio} ORDER BY Producto`;
    const responseTransaction = await  dbObject.executeSql(Query, []).then(
        response => response
    )
    return this.formatResultToModel(responseTransaction);
  }

  formatResultToModel(data) {
    let productCampania: Array<ProductoCampanaModel> = [];
    if (data.rows.length > 0) {
      for (let index = 0; index < data.rows.length; index++) {
        productCampania.push(data.rows.item(index));
      }
    }
    console.log("Table Products Campania : ", productCampania)
    return productCampania;
  }

}