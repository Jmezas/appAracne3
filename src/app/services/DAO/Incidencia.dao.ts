import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { IncidenciaDBModel } from 'src/app/shared/models/Incidencia.interface';
import { generateQuestionMark } from 'src/app/shared/utils/string.utils';

const TABLE_DB = 'Incidencias';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaDao {
  createTable(dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS '${TABLE_DB}'`+
                "('IdLocal' INTEGER PRIMARY KEY AUTOINCREMENT, "+
                    "'IdIncidencia' TEXT, "+
                    "'IdJornada' TEXT, "+
                    "'IdTipoIncidencia' TEXT, "+
                    "'IdSubTipoIncidencia' TEXT, "+
                    "'IdEstadoIncidencia' TEXT, "+
                    "'Observaciones' TEXT, "+
                    "'FotoIncidenciaA' TEXT, "+
                    "'FotoIncidenciaB' TEXT, "+
                    "'IdIncidenciaProducto' TEXT, "+
                    "'UsModificacion' TEXT, "+
                    "'FeModificacion' TEXT, "+
                    "'UsCreacion' TEXT, "+
                    "'FeCreacion' TEXT, "+
                    "'TipoIncidencia' TEXT, "+
                    "'Otras' TEXT, "+
                    "'EstadoIncidencia' TEXT, "+
                    "'Gestion' TEXT, "+
                    "'IdCampania' TEXT, "+
                    "'idProducto' TEXT, "+
                    "'IdUsuario' TEXT, "+
                    "'Fecha' TEXT, "+
                    "'IDPV' TEXT, "+
                    "'Campania' TEXT, "+
                    "'IdLineaNegocio' TEXT, "+
                    "'IdGrupoIncidencia' TEXT, "+
                    "'GrupoIncidencia' TEXT, "+
                    "'Responsable' TEXT, "+
                    "'CorreoResponsable' TEXT, "+
                    "'CorreoCopia' TEXT, "+
                    "'Oportunidades' TEXT, "+
                    "'Status' TEXT, "+
                    "'ErrorMessage' TEXT, "+
                    "'FechaError' TEXT)";

    dbObject.executeSql(Query, []).then(
        (response ) => {
          console.log("DB : Tabla Incidencias creada correctamente : ", response);
          return true;
        }
    ).catch(
        (error) => {
          console.log("DB ERROR : Tabla Incidencias no se creo : ", JSON.stringify(error));
          return false;
        }
    )
  }

  async insert(iDB: IncidenciaDBModel, dbObject: SQLiteObject) {
    const fields: Array<string> = ['IdIncidencia', 'IdJornada', 'IdTipoIncidencia', 'IdSubTipoIncidencia', 'IdEstadoIncidencia', 'Observaciones', 'FotoIncidenciaA', 'FotoIncidenciaB', 'IdIncidenciaProducto', 'UsModificacion', 'FeModificacion', 'UsCreacion', 'FeCreacion', 'TipoIncidencia', 'Otras', 'EstadoIncidencia', 'Gestion', 'IdCampania', 'idProducto', 'IdUsuario', 'Fecha', 'IDPV', 'Campania', 'IdLineaNegocio', 'IdGrupoIncidencia', 'GrupoIncidencia', 'Responsable', 'CorreoResponsable', 'CorreoCopia', 'Oportunidades', 'Status', 'ErrorMessage', 'FechaError']
    const data = fields.map(item => iDB[item] ? iDB[item]: null);
    const values = generateQuestionMark(fields);
    const Query = `INSERT OR REPLACE INTO ${TABLE_DB} (${fields.toString()}) VALUES (${values})`;
    const resultTransaction = await dbObject.executeSql(Query, data)
      .then((result) => {
        console.log("DB : Tabla Incidencia INSERT OK ", JSON.stringify(result));
        return true;
      })
      .catch(error => {
        console.log('DB ERROR : Tabla Incidencia ERROR ' + JSON.stringify(error));
        return false
      });
      console.log("RESPONSE TRANSACTION : ", resultTransaction)
    return resultTransaction;
  }

  async getAllByJornada (idJornada: string, businessLineId: string, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE IdJornada = '${idJornada}';`;
    
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => result
    ).catch(error => {
      console.log('DB ERROR : Tabla Incidencia GET ASISTENCIA2 ' + JSON.stringify(error));
      return []
    });
    return this.formatResultToModel(dataResult);
  }

  async getIncidenciasByStatus (status: SyncStatus, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE Status='${status}';`;
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => result
    ).catch(error => {
      // console.log('DB ERROR : Tabla Incidencia GET ASISTENCIA BY STATUS ' + JSON.stringify(error));
      return []
    });
    return this.formatResultToModel(dataResult);
  }

  async deleteLocalIncidencia(idIncidencia: number, dbObject: SQLiteObject) {
    const Query = `DELETE FROM ${TABLE_DB} WHERE IdLocal = ${idIncidencia};`
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
    let incidencias: Array<IncidenciaDBModel> = [];
    if (data.rows.length > 0) {
      for (let index = 0; index < data.rows.length; index++) {
        incidencias.push(data.rows.item(index));
      }
    }
    console.log("Table Incidencia : ", incidencias)
    return incidencias;
  }

}
