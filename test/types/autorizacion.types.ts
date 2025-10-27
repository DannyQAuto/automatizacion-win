export interface AutorizacionParams {
    npedido: string;
nserie: string;
subida: string;
bajada: string;
vlan: string;
zona: string;
ticked: string;
}

export interface LiberarParams {
nserie: string;
ticked: string;
}

export interface AutorizacionRequest {
method: string;
params: AutorizacionParams;
}

export interface LiberarRequest {
method: string;
params: LiberarParams;
}

export interface PuertoInfo {
did: string;
fn: string;
sn: string;
pn: string;
ontid: string;
ontportid: string;
inoctes: string;
inucastpkts: string;
indiscards: string;
inerrors: string;
outoctes: string;
outucastpkts: string;
outdiscards: string;
outerrors: string;
txrate: number;
rxrate: number;
}

export interface AutorizacionResponse {
status: number;
msg: string;
data: {
olt_name: string;
olt_board: string;
olt_port: string;
olt_onu: string;
puerto_logico_adhoc: string;
olt_id: string;
potencia_ont: number;
potencia_olt: number;
name: string;
ipont: string;
perfil_subida: string;
perfil_bajada: string;
onu_type_name: string;
txrate: string;
rxrate: string;
puertos: PuertoInfo[];
memory: string;
cpu: string;
};
idpeticion: string;
}

export interface LiberarResponse {
status: number;
msg: string;
data?: any;
idpeticion: string;
}