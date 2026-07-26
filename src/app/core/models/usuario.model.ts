export interface Usuario {
  id: number;
  nombreUsuario: string;
}

export interface UsuarioCreate {
  nombreUsuario: string;
  password: string;
}

export interface UsuarioLogin {
  nombreUsuario: string;
  password: string;
}
