import { hashCodeString } from "../utils/string.utils";

export class EmployeeClass {
    private id: number;
    private firstName: string;
    private lastName: string;
    private salary: number;
  
    constructor(id: number, firstName: string, lastName, salary: number) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.salary = salary;
    }
  
    getName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
  
    getYearlySalary(): number {
      return 12 * this.salary;
    }
  }

export class ApiAsignacionPV {
    public IDPV: string;
    public IdUsuario: string;
    public IdCampaña: string;
    public Nombre_Completo: string;
    public NombreCentro: string;
    public Direccion: string;
    public IdAux_PV_Usuario: string;
    public IdEstadoReporte: string;
    public UsCreacion: string;
    public FechaJornada: string;
    public FeCreacion: string;
    public HoraInicio: string;
    public HoraFin: string;
    public IdTipoJornada: string;
    public IdTurno: string;
    public IdLineaNegocio: string;


    // public equals(Object o): boolean {
    //     if (     == o) return true;
    //     if (o == null || getClass() != o.getClass()) return false;

    //     com.aracnereport.aracne.promotoria.data.service.model.ApiAsignacionPV that = (com.aracnereport.aracne.promotoria.data.service.model.ApiAsignacionPV) o;

    //     if (IDPV != null ? !IDPV.equals(that.IDPV) : that.IDPV != null) return false;
    //     if (IdUsuario != null ? !IdUsuario.equals(that.IdUsuario) : that.IdUsuario != null)
    //         return false;
    //     return IdCampaña != null ? IdCampaña.equals(that.IdCampaña) : that.IdCampaña == null;
    // }

    public hashCode(): number {
        let result: number = this.IDPV != null ? hashCodeString(this.IDPV) : 0;
        result = 31 * result + (this.IdUsuario != null ? hashCodeString(this.IdUsuario) : 0);
        result = 31 * result + (this.IdCampaña != null ? hashCodeString(this.IdCampaña) : 0);
        return result;
    }

    public toString(): string {
        return "ApiAsignacionPV{" +
                "IDPV='" + this.IDPV + '\'' +
                ", IdUsuario='" + this.IdUsuario + '\'' +
                ", IdCampaña='" + this.IdCampaña + '\'' +
                ", FechaJornada='" + this.FechaJornada + '\'' +
                '}';
    }
}
