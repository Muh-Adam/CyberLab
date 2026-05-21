# ☁️ P18 — CLOUD SECURITY

> *"The cloud is just someone else's computer — and you're responsible for securing your part."*

---

## 1. SHARED RESPONSIBILITY MODEL

```
┌─────────────────────────────────────────────────────┐
│              SHARED RESPONSIBILITY                    │
├──────────────┬──────────────┬───────────────────────┤
│    IaaS      │     PaaS     │        SaaS           │
│  (EC2, VM)   │  (Lambda,    │  (Office 365,         │
│              │   App Engine)│   Gmail, Salesforce)   │
├──────────────┼──────────────┼───────────────────────┤
│ YOU manage:  │ YOU manage:  │ YOU manage:           │
│ ▸ Data       │ ▸ Data       │ ▸ Data                │
│ ▸ App        │ ▸ App        │ ▸ User access         │
│ ▸ OS         │              │                       │
│ ▸ Network    │              │                       │
├──────────────┼──────────────┼───────────────────────┤
│ CLOUD manages│ CLOUD manages│ CLOUD manages:        │
│ ▸ Hypervisor │ ▸ OS         │ ▸ Everything else     │
│ ▸ Physical   │ ▸ Runtime    │                       │
│ ▸ Network HW │ ▸ Physical   │                       │
└──────────────┴──────────────┴───────────────────────┘

ATURAN: Cloud provider mengamankan cloud INFRASTRUCTURE.
        Kamu mengamankan apa yang kamu TARUH di cloud.
```

---

## 2. AWS IAM SECURITY

### Common IAM Misconfigurations

```json
// ❌ BURUK: Wildcard permissions (God Mode)
{
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
}

// ✅ BAIK: Least privilege
{
    "Effect": "Allow",
    "Action": [
        "s3:GetObject",
        "s3:ListBucket"
    ],
    "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
    ]
}
```

### IAM Best Practices
1. **Jangan gunakan root account** untuk operasi harian
2. **Enable MFA** di semua akun, terutama root
3. **Least privilege** — berikan permission minimum
4. **Gunakan IAM Roles** bukan hardcoded credentials
5. **Rotate access keys** secara berkala
6. **Monitor** dengan CloudTrail

---

## 3. CONTAINER SECURITY (Docker)

### Docker Security Risks

| Risiko | Penjelasan | Mitigasi |
|--------|------------|----------|
| **Vulnerable base image** | Image mengandung CVE | Scan dengan Trivy |
| **Running as root** | Container jalan sebagai root | `USER nonroot` di Dockerfile |
| **Exposed secrets** | API keys di Dockerfile/ENV | Gunakan Docker Secrets |
| **Unrestricted capabilities** | Container punya terlalu banyak privilege | `--cap-drop ALL` |
| **Unpatched images** | Image tidak di-update | Rebuild & scan regularly |

### Docker Hardening

```bash
# Scan image dengan Trivy
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL myapp:v1.0

# Run container dengan security best practices
docker run -d \
    --name secure_app \
    --read-only \                    # Filesystem read-only
    --cap-drop ALL \                 # Drop semua capabilities
    --cap-add NET_BIND_SERVICE \     # Hanya tambah yang dibutuhkan
    --security-opt no-new-privileges \ # Cegah privilege escalation
    --user 1000:1000 \               # Non-root user
    --memory 512m \                  # Limit memory
    --cpus 1.0 \                     # Limit CPU
    myapp:v1.0
```

```dockerfile
# Dockerfile yang aman
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 4. KUBERNETES SECURITY BASICS

```yaml
# Pod Security — Restricted policy
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    image: myapp:v1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
    resources:
      limits:
        memory: "256Mi"
        cpu: "500m"
```

### RBAC (Role-Based Access Control)
```yaml
# Role: hanya bisa read pods di namespace "dev"
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

---

## 5. CHECKLIST PEMAHAMAN P18

- [ ] Jelaskan Shared Responsibility Model
- [ ] Identifikasi IAM misconfiguration dari policy JSON
- [ ] Scan Docker image dengan Trivy
- [ ] Tulis Dockerfile yang aman
- [ ] Jelaskan RBAC di Kubernetes
- [ ] Setup LocalStack untuk simulasi AWS
- [ ] Apa risiko container running as root?

---

*Selanjutnya: [P19 — DevSecOps & Secure SDLC](./P19-DevSecOps.md)*
