# Registro compartido de usuarios Canelillo

Usar `public.usuarios` como perfil central para todas las apps:

- AgroCore
- Canelillo Harvest
- Calicatas
- Riego
- Fertilizacion

## SQL requerido

Ejecutar en Supabase:

```sql
-- Archivo del proyecto
supabase_registro_usuarios_compartido.sql
```

Ese SQL crea un trigger sobre `auth.users`. Cuando cualquier app registra un usuario en Supabase Auth, el trigger crea o completa el perfil en `public.usuarios`.

## Metadata que debe mandar cada app

Al llamar a `signUp`, mandar esta metadata:

```json
{
  "full_name": "Nombre Apellido",
  "nombre_completo": "Nombre Apellido",
  "rut": "12.345.678-9",
  "role": "supervisor",
  "rol": "supervisor",
  "area": "cosecha",
  "app_origen": "canelillo_harvest"
}
```

## Roles soportados

La base normaliza estos valores:

- `admin`, `administrador` -> `admin`
- `supervisor`, `jefe`, `encargado` -> `supervisor`
- cualquier otro -> `bodeguero`

## Areas soportadas

- `todas`
- `agrocore`
- `cosecha`
- `calicatas`
- `riego`
- `fertilizacion`

## Regla practica

Todas las apps deben iniciar sesion contra el mismo Supabase Auth y leer el perfil desde:

```sql
public.usuarios where id = auth.uid()
```

Si `activo = false`, la app debe bloquear el acceso aunque Supabase Auth permita iniciar sesion.
