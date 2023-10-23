import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { JornadaPVModelDB } from 'src/app/shared/models/jornada.interface';

const TABLE_DB = 'Jornadas';
@Injectable({
  providedIn: 'root'
})
export class JornadaDao {
  constructor() {}

  createTable(dbObject: SQLiteObject) {
    const Query =
      `CREATE TABLE IF NOT EXISTS ${TABLE_DB}` +
      "('IdJornada' TEXT NOT NULL, " +
      "'FechaJornada' TEXT, " +
      "'TipoJornada' TEXT, " +
      "'Turno' TEXT, " +
      "'Fecha_Hora_Inicio' TEXT, " +
      "'Fecha_Hora_Fin' TEXT, " +
      "'IDPV' TEXT, " +
      "'Latitud' TEXT, " +
      "'Longitud' TEXT, " +
      "'Punto_Venta' TEXT, " +
      "'Direccion' TEXT, " +
      "'CodigoPostal' TEXT, " +
      "'CodigoPV' TEXT, " +
      "'Provincia' TEXT, " +
      "'Gestor' TEXT, " +
      "'Observaciones' TEXT, " +
      "'Estado' TEXT, " +
      "'IdUsuario' TEXT, " +
      "'IdCampana' TEXT, " +
      "'Punto_Venta_Calendar' TEXT, " +
      "'Direccion_Calendar' TEXT, " +
      "'Color_Marcador' TEXT, " +
      "'IdTipoJornada' TEXT, " +
      "'IdTurno' TEXT, " +
      "'ID_Jefe_Equipo' TEXT, " +
      "'Rol' TEXT, " +
      "'IdCampanaUsuario' TEXT, " +
      "'ReporteObligatorio' TEXT, " +
      "'EstadoJornada' TEXT, " +
      "'IdEstadoJornada' TEXT, " +
      "'AsistenciaObligatoria' TEXT, " +
      "'CheckIN' TEXT, " +
      "'CheckOUT' TEXT, " +
      "'Distancia' TEXT, " +
      "'IdEstadoReporte' TEXT, " +
      "'Abordajes' TEXT, " +
      "'AsistenciaPromotoriaObligatorio' TEXT, " +
      "'GeoPromotoriaObligatorio' TEXT, " +
      "'AbordajesApMobObligatorio' TEXT, " +
      "'ReporteSinAsistencia' TEXT, " +
      "'Asistencia' TEXT, " +
      "'UsModificacion' TEXT, " +
      "'FeModificacion' TEXT, " +
      "'IdLineaNegocio' TEXT, " +
      "'HoraAsis' TEXT, " +
      "'Status' TEXT, " +
      "'ErrorMessage' TEXT, " +
      "PRIMARY KEY('IdJornada'))";

    dbObject
      .executeSql(Query, [])
      .then((response) => {
        console.log('DB : Tabla Jornadas creada correctamente : ', response);
        return true;
      })
      .catch((error) => {
        console.log(
          'DB ERROR : Tabla Jornadas no se creo : ',
          JSON.stringify(error)
        );
        return false;
      });
  }

  async findById(idJornada: string, businessLineId: string, dbObject: SQLiteObject) {
    const Query = `SELECT * FROM ${TABLE_DB} WHERE IdJornada = ${idJornada} AND IdLineaNegocio = ${businessLineId}`;
    const responseTransaction = dbObject.executeSql(Query).then(
      response => response
    );
    return this.formatResultToModel(responseTransaction)[0] || null;
  }

  updateCheck(
    jornadaPV: string,
    idJornada: string,
    UsModificacion: string,
    IdLineaNegocio: string,
    checkIn: string,
    status: string
  ) {
    const Query = `UPDATE ${TABLE_DB} set jorna`;
  }

  formatResultToModel(data) {
    let jornadas: Array<JornadaPVModelDB> = [];
    if (data.rows.length > 0) {
      for (let index = 0; index < data.rows.length; index++) {
        jornadas.push(data.rows.item(index));
      }
    }
    console.log("Table Jornada : ", jornadas)
    return jornadas;
  }
}
