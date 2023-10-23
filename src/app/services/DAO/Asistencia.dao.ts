
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { AsistenciaDBModel } from 'src/app/shared/models/asistencia.interface';

const TABLE_DB = 'Asistencias';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaDao {
  createTable(dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS ${TABLE_DB} `+
    "(`LocalId` INTEGER PRIMARY KEY AUTOINCREMENT, "+
    "`IdAsistencia` TEXT, "+
    "`IdJornada` TEXT, "+
    "`FechaReg` TEXT, "+
    "`FechaHoraIni` TEXT, "+
    "`Latitud` TEXT, "+
    "`Longitud` TEXT, "+
    "`TipoAsistencia` TEXT, "+
    "`UsCreacion` TEXT, "+
    "`Observacion` TEXT, "+
    "`FechaHoraSync` TEXT, "+
    "`LogAsistencia` TEXT, "+
    "`LogGeo` TEXT, "+
    "`IdLineaNegocio` TEXT, "+
    "`IdCampana` TEXT, "+
    "`Status` TEXT, "+
    "`ErrorMessage` TEXT, "+
    "`FechaError` TEXT, "+
    "`imagepath` TEXT, "+
    "`NombreCampaña` TEXT, "+
    "`Imei` TEXT)";
    dbObject.executeSql(Query, []).then(
        (response ) => {
          console.log("DB : Tabla Asistencias creada correctamente : ", response);
          return true;
        }
    ).catch(
        (error) => {
          console.log("DB ERROR : Tabla Asistencia no se creo : ", JSON.stringify(error));
          return false;
        }
    )
  }

  async insert(aDB: AsistenciaDBModel, dbObject: SQLiteObject) {
    const fields: Array<string> = ['IdAsistencia','IdJornada','FechaReg','FechaHoraIni','Latitud','Longitud','TipoAsistencia','UsCreacion','Observacion','FechaHoraSync','LogAsistencia','LogGeo','IdLineaNegocio','IdCampana','Status','ErrorMessage','FechaError','imagepath','NombreCampaña','Imei']
    const data = fields.map(item => aDB[item]);
    console.log("DATA INSTER ASISTENCIA : ", JSON.stringify(data));
    console.log("DATA INSTER ASISTENCIA : ", fields.toString());
    const Query = `INSERT OR REPLACE INTO ${TABLE_DB} (${fields.toString()}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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

  async findById(idJornada: string, businessLineId: string, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE IdJornada = ${idJornada} AND IdLineaNegocio = ${businessLineId}`;
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => {
        return result
      }
    ).catch(error => {
      console.log('DB ERROR : Tabla Asistencia GET ASISTENCIA ' + JSON.stringify(error));
      return []
    });

    return this.formatResultToModel(dataResult);
  }

  async getExhibicionsByStatus(status: SyncStatus, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE Status='${status}';`;
    console.log("QUERY ASISTENCIAS STATUS : ", Query);
    
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => result
    ).catch(error => {
      console.log('DB ERROR : Tabla Asistencias BY STATUS ' + JSON.stringify(error));
      return []
    });
    return this.formatResultToModel(dataResult);
  }

  async deleteLocalAssistence(idJornada: number, dbObject: SQLiteObject) {
    const Query = `DELETE FROM ${TABLE_DB}`; // WHERE IdJornada = ${idJornada};
    console.log("QUERY DELETE ASISTENCIA: ", Query);
    
    const resultTransaction = await dbObject.executeSql(Query , )
    .then(result => true )
    .catch(error => {
      console.log("ERROR : ", error);
      
      if(error.rowsAffected == 1){
        return true;
      }
      return false;
    });
    return resultTransaction;
  }

  async getAll (dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB}`;
    const dataResult = await dbObject.executeSql(Query, []).then(
      result => result
    ).catch(error => {
      console.log('DB ERROR : Tabla Asistencia GET ASISTENCIA2 ' + JSON.stringify(error));
      return []
    });
    return this.formatResultToModel(dataResult);
  }


  formatResultToModel(data) {
    let asistencias: Array<AsistenciaDBModel> = [];
    if (data.rows.length > 0) {
      for (let index = 0; index < data.rows.length; index++) {
        asistencias.push(data.rows.item(index));
      }
    }
    console.log("Table Asistencias : ", asistencias)
    return asistencias;
  }
}
