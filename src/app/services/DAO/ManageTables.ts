import { Injectable } from "@angular/core";
import { SQLiteObject } from "@awesome-cordova-plugins/sqlite/ngx";
import { AsistenciaDao } from "./Asistencia.dao"
import { ExhibicionDao } from "./Exhibicion.dao";
import { IncidenciaDao } from "./Incidencia.dao";
import { JornadaDao } from "./Jornada.dao";
import { ProductosCampanaDao } from "./ProductCampania.dao";
import { ReporteDao } from "./Report.dao";

@Injectable({
    providedIn: 'root'
})

export class ManageTables  {
    constructor(
        private asistenciaDao: AsistenciaDao,
        private exhibicionesDao: ExhibicionDao,
        private reporteDao: ReporteDao,
        private productoCampaniaDao: ProductosCampanaDao,
        private jornadaDao: JornadaDao,
        private incideciaDao: IncidenciaDao
    ) {}

    createAllTables(dbObject: SQLiteObject) {
        this.asistenciaDao.createTable(dbObject);
        this.exhibicionesDao.createTable(dbObject);
        this.reporteDao.createTable(dbObject);
        this.productoCampaniaDao.createTable(dbObject);
        this.jornadaDao.createTable(dbObject);
        this.incideciaDao.createTable(dbObject);
    }
}