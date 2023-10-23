import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { ExhibicionDBModel } from 'src/app/shared/models/Exhibicion.interface';

const TABLE_DB = 'Exhibiciones';

@Injectable({
  providedIn: 'root'
})
export class ExhibicionDao {
  createTable(dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS '${TABLE_DB}' `+
                    "('IdLocal' INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "'IdFoto' TEXT, "+
                    "'IdJornada' TEXT, "+
                    "'IdTipoCategoriaFoto' TEXT, "+
                    "'Foto' TEXT, "+
                    "'Foto2' TEXT, "+
                    "'Foto3' TEXT, "+
                    "'Observaciones' TEXT, "+
                    "'UsCreacion' TEXT, "+
                    "'FeCreacion' TEXT, "+
                    "'Fecha' TEXT, "+
                    "'UsModificacion' TEXT, "+
                    "'FeModificacion' TEXT, "+
                    "'Campana' TEXT, "+
                    "'IdCampana' TEXT, "+
                    "'TipoFamiliaFoto' TEXT, "+
                    "'TipoSubFamiliaFoto' TEXT, "+
                    "'TipoCategoriaFoto' TEXT, "+
                    "'IdLineaNegocio' TEXT, "+
                    "'Status' TEXT, "+
                    "'MensajeDeError' TEXT, "+
                    "'FechaDeError' TEXT, "+
                    "'PrecioExhibi' TEXT, "+
                    "'PrecioSitema' TEXT, "+
                    "'CantidadSotck' TEXT, "+
                    "'ExhiDisponible' TEXT)";
    console.log("QUERY RESULT : ", Query)

    dbObject.executeSql(Query, []).then(
        (response ) => {
          console.log("DB : Tabla Exhibiciones creada correctamente : ", response);
          return true;
        }
    ).catch(
        (error) => {
          console.log("DB ERROR : Tabla Exhibiciones no se creo : ", JSON.stringify(error));
          return false;
        }
    )
  }


  async insert(eDB: ExhibicionDBModel, dbObject: SQLiteObject) {
    const fields: Array<string> = ['IdFoto', 'IdJornada', 'IdTipoCategoriaFoto', 'Foto', 'Foto2', 'Foto3', 'Observaciones', 'UsCreacion', 'FeCreacion', 'Fecha', 'UsModificacion', 'FeModificacion', 'Campana', 'IdCampana', 'TipoFamiliaFoto', 'TipoSubFamiliaFoto', 'TipoCategoriaFoto', 'IdLineaNegocio', 'Status', 'MensajeDeError', 'FechaDeError', 'PrecioExhibi', 'PrecioSitema', 'CantidadSotck', 'ExhiDisponible']
    const data = fields.map(item => eDB[item] ? eDB[item]: null);
    console.log("DATA INSTER ASISTENCIA : ", JSON.stringify(data));
    console.log("DATA INSTER ASISTENCIA : ", fields.toString());
    const Query = `INSERT OR REPLACE INTO ${TABLE_DB} (${fields.toString()}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const resultTransaction = await dbObject.executeSql(Query, data)
      .then((result) => {
        console.log("DB : Tabla Asistencias INSERT OK ", JSON.stringify(result));
        return true;
      })
      .catch(error => {
        console.log('DB ERROR : Tabla Asistencia ERROR ' + JSON.stringify(error));
        return false
      });
      console.log("RESPONSE TRANSACTION : ", resultTransaction)
    return resultTransaction;
  }

  async getExhibicionsByStatus (status: SyncStatus, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE Status='${status}';`;
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => result
    ).catch(error => {
      console.log('DB ERROR : Tabla Exhibiciones BY STATUS ' + JSON.stringify(error));
      return []
    });
    return this.formatResultToModel(dataResult);
  }

  async deleteLocalExhibicion(idExhibicion: number, dbObject: SQLiteObject) {
    const Query = `DELETE FROM ${TABLE_DB} WHERE IdLocal = ${idExhibicion};`
    const resultTransaction = await dbObject.executeSql(Query , )
    .then(result => true )
    .catch(error => {
      if(error.rowsAffected == 1){
        return true;
      }
      return false;
    });
    return resultTransaction;
  }

  formatResultToModel(data) {
    let exhibiciones: Array<ExhibicionDBModel> = [];
    if (data.rows.length > 0) {
      for (let index = 0; index < data.rows.length; index++) {
        exhibiciones.push(data.rows.item(index));
      }
    }
    console.log("Table Incidencia : ", exhibiciones)
    return exhibiciones;
  }
}
