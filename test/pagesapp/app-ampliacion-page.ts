import { PageBase } from './PageBase';
import * as fs from 'fs-extra';
import * as path from 'path';

export class AmpliacionPage extends PageBase {

    public readonly MisSolicitudes = '//android.widget.ImageView[@content-desc="Mis Solicitudes"]';

    //public readonly AgregarSolicitud = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(0)';
    public readonly AgregarSolicitud = '-android uiautomator:new UiSelector().className("android.widget.ImageView").clickable(true).focusable(true).index(1)';
    public readonly SeleccionarTelefono = '-android uiautomator:new UiSelector().className("android.widget.EditText")';

    public readonly comboTipoSolicitud = '-android uiautomator:new UiSelector().descriptionContains("Tipo de solicitud")';
    public readonly SeleccionarSuspension = '-android uiautomator:new UiSelector().description("Suspensión Temporal")';

    public readonly SeleccionarFechaIni = '-android uiautomator:new UiSelector().descriptionContains("Inicio de la suspensión")';
    public readonly SeleccionarDiaIni = '-android uiautomator:new UiSelector().description("26, Wednesday, November 26, 2025")';

    public readonly SeleccionarFlecha = '-android uiautomator:new UiSelector().className("android.widget.Button").instance(3)';
    public readonly SeleccionarFechaFin = '-android uiautomator:new UiSelector().description("30, Tuesday, December 30, 2025")';
    public readonly SeleccionarBtnListo = '-android uiautomator:new UiSelector().description("Listo")';

    public readonly comboMotivo = '-android uiautomator:new UiSelector().descriptionContains("Elige")';
    public readonly SeleccionarMotivo = '-android uiautomator:new UiSelector().description("Viaje")';

    public readonly CheckBox = '-android uiautomator:new UiSelector().className("android.widget.CheckBox")';
    public readonly SeleccionarBtnEnviar = '-android uiautomator:new UiSelector().description("Enviar")';
    public readonly SeleccionarBtnConfirmar = '-android uiautomator:new UiSelector().description("Confirmar")';

    public readonly ObtenerCodigoPedido = '-android uiautomator:new UiSelector().descriptionMatches("^[0-9]+$")';
    public readonly obtenerCodigoSolicitud = '-android uiautomator:new UiSelector().descriptionContains("WIN-RQ-")';

    public readonly ObtenerEstado = '//android.view.View[@content-desc="Estado"]/following-sibling::*[1]';
    public readonly ObtenerFechaInicio = '//android.view.View[@content-desc="Inicio de suspensión temporal"]/following-sibling::*[1]';
    public readonly ObtenerFechaFin = '//android.view.View[@content-desc="Fin de suspensión temporal"]/following-sibling::*[1]';
    public readonly ObtenerDiasSuspen = '//android.view.View[@content-desc="Días suspendidos"]/following-sibling::*[1]';
    public readonly ObtenerDiasDisponi = '//android.view.View[@content-desc="Días disponibles"]/following-sibling::*[1]';
    public readonly ObtenerFechaHora = '//android.view.View[@content-desc="Fecha y hora"]/following-sibling::*[1]';

    public readonly SeleccionarDetalleSuspension = '-android uiautomator:new UiSelector().descriptionContains("Suspensión Temporal")';
    public readonly SeleccionarAmpliacion = '-android uiautomator:new UiSelector().description("Ampliar suspensión")';
    public readonly SeleccionarBtnEditar = '-android uiautomator:new UiSelector().description("Editar")';
    public readonly SeleccionarFinParaAmpliar = '-android uiautomator:new UiSelector().descriptionContains("Fin de la suspensión")';
    public readonly SeleccionarNuevoFinParaAmpliar = '-android uiautomator:new UiSelector().description("31, Wednesday, December 31, 2025")';

    // -----------------------------------------------
    // 📌 Función interna para sumar un día
    // -----------------------------------------------
    private sumarUnDiaDesdeTexto(textoFecha: string) {

    // Buscar día por regex (solo números)
    const matchDia = textoFecha.match(/\b(\d{1,2})\b/);
    if (!matchDia) return null;

    const dia = parseInt(matchDia[1], 10);

    // Buscar mes si existe
    const meses = {
        "enero": 0, "febrero": 1, "marzo": 2, "abril": 3,
        "mayo": 4, "junio": 5, "julio": 6, "agosto": 7,
        "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
    };

    let mes = 0;
    for (const [nombre, idx] of Object.entries(meses)) {
        if (textoFecha.toLowerCase().includes(nombre)) {
            mes = idx;
            break;
        }
    }

    // Buscar año
    const matchAnio = textoFecha.match(/\b(20\d{2})\b/);
    const anio = matchAnio ? parseInt(matchAnio[1], 10) : new Date().getFullYear();

    const fecha = new Date(anio, mes, dia);
    fecha.setDate(fecha.getDate() + 1);

    return fecha.getDate().toString();
}


    // -----------------------------------------------
    // 📌 Método principal IngresarAmpliacion()
    // -----------------------------------------------
async IngresarAmpliacion(celular: string): Promise<void> {

    await this.click(this.MisSolicitudes);
    await browser.pause(8000);

    await this.click(this.SeleccionarDetalleSuspension);
    await browser.pause(1000);

    await this.click(this.SeleccionarAmpliacion);
    await browser.pause(1000);

    await this.click(this.SeleccionarBtnEditar);
    await browser.pause(1000);

    await this.click(this.SeleccionarFinParaAmpliar);
    await browser.pause(1000);

    await this.click(this.SeleccionarFlecha);
    await browser.pause(1000);

    // Obtener fecha actual del fin
    const fechaFinTexto = await $(this.ObtenerFechaFin).getText();
    console.log("📌 Fecha fin obtenida:", fechaFinTexto);

    const diaNuevo = this.sumarUnDiaDesdeTexto(fechaFinTexto);

    if (!diaNuevo) {
        throw new Error("❌ No pude extraer un día válido de la fecha: " + fechaFinTexto);
    }

    console.log("📌 Seleccionando día:", diaNuevo);

    // UiScrollable debe ir en UNA SOLA LÍNEA
    const scrollSelector =
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().descriptionStartsWith("${diaNuevo}"))`;

    await $(scrollSelector);

    await $(`android=new UiSelector().descriptionStartsWith("${diaNuevo}")`).click();
}
}


export default AmpliacionPage;
