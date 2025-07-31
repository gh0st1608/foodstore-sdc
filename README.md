# 📊 Estimación de Costos AWS para Arquitectura Serverless (FoodStore)

## 🔧 Supuestos Generales

| Recurso                    | Valor Asumido                             |
|----------------------------|--------------------------------------------|
| Invocaciones mensuales     | 1,000,000 (repartidas entre 2 Lambdas)     |
| Duración promedio Lambda   | 500 ms                                     |
| Memoria asignada Lambda    | 128 MB                                     |
| Tráfico de salida API      | 1 GB                                       |
| DynamoDB                   | 1 tabla, uso ligero (on-demand)            |
| CloudWatch Logs            | 1 GB de logs al mes                        |
| API Gateway                | HTTP API (v2)                              |
| Región                     | us-east-1                                  |

---

## 🧮 Costo Estimado por Componente

### 🟣 1. AWS Lambda

- **Costo por invocación**:  
  - 1,000,000 invocaciones → **$0.20**
- **Duración estimada**:  
  - 1,000,000 × 0.5 s × 128 MB = **64 millones de GB-s**
  - Primeros 400,000 GB-s son **gratuitos** → no hay costo adicional
- ✅ **Total Lambda:** `$0.20`

---

### 🟢 2. API Gateway (HTTP API v2)

- **Costo por invocación:**  
  - 1M invocaciones → **$1.00**
- ✅ **Total API Gateway:** `$1.00`

---

### 🟡 3. DynamoDB (On-Demand)

- Supone:  
  - 100,000 lecturas → `$0.25`  
  - 100,000 escrituras → `$1.25`
- ✅ **Total DynamoDB:** `$1.50`

---

### 🔵 4. CloudWatch Logs

- 1 GB almacenamiento: `$0.03`
- 5M PutLogEvents: `$0.50`
- ✅ **Total CloudWatch Logs:** `$0.53`

---

### 🟠 5. Tráfico de Red

- Primer GB de salida al mes es gratuito
- ✅ **Total Tráfico Salida:** `$0.00`

---

## 💰 Costos Totales Estimados

| Servicio         | Costo mensual estimado |
|------------------|------------------------|
| Lambda           | $0.20                  |
| API Gateway HTTP | $1.00                  |
| DynamoDB         | $1.50                  |
| CloudWatch Logs  | $0.53                  |
| Tráfico Salida   | $0.00                  |
| **Total**        | **≈ $3.23 USD / mes**  |

---

## 📝 Observaciones

- Esta estimación **está por debajo del nivel gratuito de AWS**.
- Para ambientes de desarrollo y MVPs es **altamente económica**.
- Si se incrementan las invocaciones a 10 millones/mes, el costo total rondaría **$10 a $12 USD/mes**.
- Si usas API Gateway **REST (v1)** en lugar de HTTP (v2), el costo aumentaría en **$2.50 USD adicionales**.

---

## 🛠️ Siguiente Paso

Para optimizar aún más los costos:
- Mantén tus Lambdas pequeñas (<256 MB).
- Minimiza tráfico de salida.
- Usa niveles gratuitos de DynamoDB y Logs.



