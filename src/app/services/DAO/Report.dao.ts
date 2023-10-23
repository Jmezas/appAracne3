
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AsistenciaDBModel } from 'src/app/shared/models/asistencia.interface';
import { ReportModel } from 'src/app/shared/models/report.interface';

const TABLE_DB = 'Reportes';

@Injectable({
  providedIn: 'root'
})
export class ReporteDao {

  createTable(dbObject: SQLiteObject) {
    const Query = `CREATE TABLE IF NOT EXISTS ${TABLE_DB} `+
        "(`IdReporte` TEXT NOT NULL, "+
        "`IdProducto` TEXT, "+
        "`IdSubFamiliaProducto` TEXT, "+
        "`SubFamiliaProducto` TEXT, "+
        "`IdFamiliaProducto` TEXT, "+
        "`FamiliaProducto` TEXT, "+
        "`IdJornada` TEXT, "+
        "`Ventas` TEXT, "+
        "`Stock` TEXT, "+
        "`StockModificado` TEXT, "+
        "`Precio` TEXT, "+
        "`Importe` TEXT, "+
        "`Observaciones` TEXT, "+
        "`UsModificacion` TEXT, "+
        "`FeModificacion` TEXT, "+
        "`UsCreacion` TEXT, "+
        "`FeCreacion` TEXT, "+
        "`PrecioRegular` TEXT, "+
        "`Flooring` TEXT, "+
        "`Producto` TEXT, "+
        "`FechaJornada` TEXT, "+
        "`Oculto` INTEGER NOT NULL, "+
        "`PrecioDescuento` TEXT, "+
        "`PVP_Normal` TEXT, "+
        "`PVP_Promo` TEXT, "+
        "`PVP_TC` TEXT, "+
        "`PREPAGO` TEXT, "+
        "`POSTPAGO` TEXT, "+
        "`PrecioTarjeta` TEXT, "+
        "`IdLineaNegocio` TEXT, "+
        "`UnidadNegocio` TEXT, "+
        "`GrupoVal` TEXT, "+
        "`VentasCompetencia` TEXT, "+
        "`Nº` TEXT, "+
        "`Stock_S` TEXT, "+
        "`Stock_R` TEXT, "+
        "`Apto` TEXT, "+
        "`No_Apto` TEXT, "+
        "`Demos` TEXT, "+
        "`ImporteTicket` TEXT, "+
        "`Facing` TEXT, "+
        "`Edad_0_20` TEXT, "+
        "`Edad_21_30` TEXT, "+
        "`Edad_31_40` TEXT, "+
        "`Edad_41_50` TEXT, "+
        "`Edad_Mas_50` TEXT, "+
        "`FechaVencimiento` TEXT, "+
        "`PrecioDcto` TEXT, "+
        "`RETIQ` TEXT, "+
        "`Stock2` TEXT, "+
        "`FechaVencimiento2` TEXT, "+
        "`Stock3` TEXT, "+
        "`FechaVencimiento3` TEXT, "+
        "`TotalKilos` TEXT, "+
        "`Ventas_0_5` TEXT, "+
        "`Ventas_6_10` TEXT, "+
        "`Ventas_mayor_10` TEXT, "+
        "`Lineal` TEXT, "+
        "`Cabecera` TEXT, "+
        "`PrecioSem` TEXT, "+
        "`PrecioFinDe` TEXT, "+
        "`Prescripciones` TEXT, "+
        "`Nombre` TEXT, "+
        "`Rut` TEXT, "+
        "`EstadoVenta` TEXT, "+
        "`Referencia` TEXT, "+
        "`Unidades` TEXT, "+
        "`SituacionStock` TEXT, "+
        "`IdCampana` TEXT, "+
        "`Activo` TEXT, "+
        "`NumeroFrentesAntes` TEXT, "+
        "`NumeroFrentesDepois` TEXT, "+
        "`SugestaoEncomenda` TEXT, "+
        "`Status` TEXT, "+
        "`ErrorMessage` TEXT, "+
        "`FechaError` TEXT, "+
        "`NumeroFrentesConcorrencia` TEXT, "+
        "`NumeroFrentesPernod` TEXT, "+
        "`PreVentaMi10T` TEXT, "+
        "`PreVentaMi10TScooter` TEXT, "+
        "`Pre` TEXT, "+
        "`StockSugerido` TEXT, "+
        "`Ingreso` TEXT, "+
        "`CantidadDiasModificar` TEXT, "+
        "`VentasTienda` TEXT, "+
        "`Reposicion` TEXT, "+
        "`QuiebreStock` TEXT, "+
        "`PedidoSugerido` TEXT, "+
        "`Transferencia` TEXT, "+
        "`StockInicial` TEXT, "+
        "`StockFinal` TEXT, "+
        "`Ingresos` TEXT, PRIMARY KEY(`IdReporte`))";
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

  async checkIfReportExistByJornada(idJornada: string, IdLineaNegocio: string, dbObject: SQLiteObject){
    const Query = `SELECT * FROM ${TABLE_DB} WHERE IdJornada = ${idJornada} AND IdLineaNegocio = ${IdLineaNegocio}`;
    const resultTransaction = await dbObject.executeSql(Query, [])
    .then((result) => {
      return result.row.length>0 ? true : false;
    })
    .catch(error => {
      console.log('DB ERROR : Tabla reports ERROR' + JSON.stringify(error));
      return false;
    });
    console.log("RESPONSE TRANSACTION : ", resultTransaction)
    return resultTransaction;
  }

  async insetAll(lsReports: Array<ReportModel> , dbObject: SQLiteObject) {
    const fields: Array<string> = ['IdReporte','IdProducto','IdSubFamiliaProducto','SubFamiliaProducto','IdFamiliaProducto','FamiliaProducto','IdJornada','Ventas','Stock','StockModificado','Precio','Importe','Observaciones','UsModificacion','FeModificacion','UsCreacion','FeCreacion','PrecioRegular','Flooring','Producto','FechaJornada','Oculto','PrecioDescuento','PVP_Normal','PVP_Promo','PVP_TC','PREPAGO','POSTPAGO','PrecioTarjeta','IdLineaNegocio','UnidadNegocio','GrupoVal','VentasCompetencia','Nº','Stock_S','Stock_R','Apto','No_Apto','Demos','ImporteTicket','Facing','Edad_0_20','Edad_21_30','Edad_31_40','Edad_41_50','Edad_Mas_50','FechaVencimiento','PrecioDcto','RETIQ','Stock2','FechaVencimiento2','Stock3','FechaVencimiento3','TotalKilos','Ventas_0_5','Ventas_6_10','Ventas_mayor_10','Lineal','Cabecera','PrecioSem','PrecioFinDe','Prescripciones','Nombre','Rut','EstadoVenta','Referencia','Unidades','SituacionStock','IdCampana','Activo','NumeroFrentesAntes','NumeroFrentesDepois','SugestaoEncomenda','Status','ErrorMessage','FechaError','NumeroFrentesConcorrencia','NumeroFrentesPernod','PreVentaMi10T','PreVentaMi10TScooter','Pre','StockSugerido','Ingreso','CantidadDiasModificar','VentasTienda','Reposicion','QuiebreStock','PedidoSugerido','Transferencia','StockInicial','StockFinal','Ingresos'];
    const resultTransaction = await dbObject.transaction(tx => {
        lsReports.forEach(itemReport => {
            const data = fields.map(item => itemReport[item]);
            tx.executeSql(this.getQueryInsert(fields), data );
        })
    }).then(
        result => {
            console.log("SE INSERTARON LOS REGISTROS CORRECTAMENTE : REPORTES : ", result)
            return result;
        }
    ).catch( error => console.log("ERROR INSERTANDO DATAOS : REPORTES: ", error));

    return resultTransaction
  }

  private getQueryInsert (fields: Array<string>, ): string{
    return `INSERT OR REPLACE INTO ${TABLE_DB} (${fields.toString()}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  }
}
