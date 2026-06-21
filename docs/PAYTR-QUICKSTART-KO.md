# PayTR 바로 시작하기 (Dami Beauty)

키를 PayTR에서 받는 **즉시** 아래 3단계만 하면 테스트 결제를 시작할 수 있습니다.

---

## 현재 준비 상태

| 항목 | 상태 |
|------|------|
| 백엔드 PayTR 연동 코드 | ✅ test/live 동일 경로 |
| `PAYTR_TEST_MODE=true` (Railway) | ✅ 설정됨 |
| `PAYTR_ALLOW_DEV_MOCK=false` (Railway) | ✅ 프로덕션에서 mock 비활성 |
| Callback URL 경로 | ✅ `/api/v1/payment/paytr/callback` |
| 프론트 체크아웃 + Test Modu 배너 | ✅ 배포됨 |
| PayTR Merchant 키 | ⏳ PayTR 패널에서 입력 필요 |

**확인 URL**
- Health: https://dami-beauty-api-production.up.railway.app/health  
- PayTR 상태: https://dami-beauty-api-production.up.railway.app/api/v1/payment/paytr/status  
- 쇼핑몰: https://dami-beauty.vercel.app  

키 넣기 전 `paytr.mode`는 `"unconfigured"` — 정상입니다.

---

## Step 1 — Railway에 PayTR 키 등록 (1분)

PowerShell, 프로젝트 루트에서:

```powershell
.\scripts\set-paytr-railway.ps1 `
  -MerchantId "PayTR에서_받은_ID" `
  -MerchantKey "PayTR에서_받은_KEY" `
  -MerchantSalt "PayTR에서_받은_SALT"
```

Railway가 자동 재배포됩니다. 1~2분 후:

```powershell
curl https://dami-beauty-api-production.up.railway.app/api/v1/payment/paytr/status
```

`"mode":"test"` 이고 `"configured":true` 이면 OK.

---

## Step 2 — PayTR 패널 Bildirim URL (1분)

PayTR 가맹점 panel → **Bildirim URL** 에 아래 주소 **그대로** 등록:

```
https://dami-beauty-api-production.up.railway.app/api/v1/payment/paytr/callback
```

---

## Step 3 — 테스트 결제 (5분)

1. https://dami-beauty.vercel.app → 상품 → 장바구니 → 체크아웃  
2. iframe 상단 **「PayTR Test Modu」** 배너 확인  
3. PayTR 패널의 **테스트 카드** 번호로 결제  
4. 성공 시 주문 `paid`, 재고 감소 확인 (Admin → Orders)

실패 테스트도 1회: 카드 거절 → checkout으로 돌아오며 오류 메시지

---

## 라이ve 전환 (나중에)

Railway에서 한 줄만 변경:

```
PAYTR_TEST_MODE=false
```

PayTR 패널에 동일 callback URL (라이ve) 재등록 → 소액 실결제 1건 테스트.

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| `PayTR yapılandırılmadı` | Step 1 Railway 키 3개 확인 |
| iframe 안 뜸 | `/health` → paytr.mode 가 `test` 인지 확인 |
| 결제 성공인데 pending | Callback URL 패널 등록 확인 (Step 2) |
| hash failed | KEY/SALT 오타 — PayTR 패널 값 재복사 |

상세: [paytr-setup.md](./paytr-setup.md)
