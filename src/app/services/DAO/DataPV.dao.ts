
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

const TABLE_DB = 'DatosPV';

@Injectable({
  providedIn: 'root'
})
export class DataPVDAO {
  createTable(dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS ${TABLE_DB} `+
    "('IDPV' TEXT NOT NULL, "+
    "'IdCampana' TEXT, "+
    "'Grupo' TEXT, "+
    "'NombreCentro' TEXT, "+
    "'Direccion' TEXT, "+
    "'Provincia' TEXT, "+
    "'Poblacion' TEXT, "+
    "'CodigoPostal' TEXT, "+
    "'CodigoPV' TEXT, "+
    "'Observaciones' TEXT, "+
    "'Distancia' TEXT, "+
    "'Zona' TEXT, "+
    "'Telefono' TEXT, "+
    "'Latitud' TEXT, "+
    "'Longitud' TEXT, "+
    "'Activo' TEXT, "+
    "'IdPoblacion' TEXT, "+
    "'IdProvincia' TEXT, "+
    "'IdPais' TEXT, "+
    "'Pais' TEXT, "+
    "'IdGrupo' TEXT, "+
    "'IdZona' TEXT, "+
    "'IdLineaNegocio' TEXT, "+
    "'Status' TEXT, "+
    "PRIMARY KEY('IDPV'))";
    dbObject.executeSql(Query, []).then(
        (response ) => {
          console.log("DB : Tabla DatosPV creada correctamente : ", response);
          return true;
        }
    ).catch(
        (error) => {
          console.log("DB ERROR : Tabla DatosPV no se creo : ", JSON.stringify(error));
          return false;
        }
    )
  }

  // async insert(aDB: AsistenciaDBModel, dbObject: SQLiteObject) {
  //   const fields: Array<string> = ['IDPV', 'IdCampana', 'Grupo', 'NombreCentro', 'Direccion', 'Provincia', 'Poblacion', 'CodigoPostal', 'CodigoPV', 'Observaciones', 'Distancia', 'Zona', 'Telefono', 'Latitud', 'Longitud', 'Activo', 'IdPoblacion', 'IdProvincia', 'IdPais', 'Pais', 'IdGrupo', 'IdZona', 'IdLineaNegocio', 'Status']
  //   const data = fields.map(item => aDB[item]);
  //   console.log("DATA INSTER DatosPV : ", JSON.stringify(data));
  //   console.log("DATA INSTER DatosPV : ", fields.toString());
  //   const Query = `INSERT OR REPLACE INTO ${TABLE_DB} (${fields.toString()}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  //   const resultTransaction = await dbObject.executeSql(Query, data)
  //     .then((result) => {
  //       console.log("DB : Tabla Asistencias INSERT OK ", JSON.stringify(result));
  //       return true;
  //     })
  //     .catch(error => {
  //       console.log('DB ERROR : Tabla Asistencia ERROR ' + JSON.stringify(error));
  //       return false
  //     });
  //     console.log("RESPONSE TRANSACTION : ", resultTransaction)
  //   return resultTransaction;
  // }
}
