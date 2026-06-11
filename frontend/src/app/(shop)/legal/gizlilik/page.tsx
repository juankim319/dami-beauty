import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  SELLER_NAME,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Dami Beauty",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni">

      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, veri sorumlusu sıfatıyla{" "}
        <strong>{CONTACT_ADDRESS}</strong> adresinde mukim <strong>{SELLER_NAME} (Dami)</strong> (Bundan sonra
        &quot;Şirket&quot; veya &quot;Dami&quot; olarak anılacaktır) olarak, e-ticaret platformumuz (Web sitemiz),
        mobil uygulamalarımız ve dijital kanallarımız üzerinden bizimle paylaştığınız kişisel verilerinizin güvenliğine büyük önem veriyoruz.
        Kişisel verileriniz, aşağıda belirtilen amaçlar doğrultusunda, hukuka ve dürüstlük kurallarına uygun olarak işlenmekte,
        saklanmakta ve aktarılmaktadır.
      </p>

      <h2>2. İşlenen Kişisel Veri Kategorileri ve Detayları</h2>
      <p>
        Dami tarafından web sitesi üyeliği, alışveriş süreçleri, bülten kayıtları ve müşteri ilişkileri kapsamında
        doğrudan sizden veya sitenin kullanımı sırasında otomatik yöntemlerle toplanan veri kategorileri aşağıdadır:
      </p>
      <ul>
        <li>
          <strong>Kimlik Bilgileri:</strong> Ad, soyadı, T.C. kimlik numarası (fatura düzenleme zorunluluğu kapsamında
          gerekmesi halinde), doğum tarihi (yaş doğrulaması için).
        </li>
        <li>
          <strong>İletişim Bilgileri:</strong> E-posta adresi, cep telefonu numarası, teslimat adresi, fatura adresi.
        </li>
        <li>
          <strong>Müşteri İşlem Bilgileri:</strong> Sipariş bilgileri, sepet geçmişi, fatura ve irsaliye bilgileri,
          satın alınan ürün detayları, kargo takip numarası, müşteri talepleri, şikayet formları ve destek talebi
          kayıtları.
        </li>
        <li>
          <strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, web sitesi giriş-çıkış (log) kayıtları, kullanıcı
          adı ve şifre bilgileri (şifrelenmiş olarak), trafik verileri, tarayıcı bilgileri, cihaz türü ve ID
          bilgisi, çerez (cookie) kayıtları.
        </li>
        <li>
          <strong>Finansal Bilgiler:</strong> Ödeme yöntemi tercihi, iade işlemlerinde kullanılmak üzere IBAN ve
          banka hesap bilgileri. (Not: Kredi veya banka kartı numarası, son kullanma tarihi ve CVV kodları Dami
          altyapısında kesinlikle tutulmamaktadır; ödemeler doğrudan BDDK lisanslı aracı ödeme kuruluşları/sanal
          POS sistemleri üzerinden uçtan uca şifreli olarak gerçekleşmektedir.)
        </li>
        <li>
          <strong>Pazarlama ve Davranışsal Veriler:</strong> Web sitesi içi hareketler, ilgi alanları, sepete ekleme
          ve bırakma davranışları, kampanya katılım geçmişi, anket cevapları, ticari elektronik ileti izin onay
          durumları ve Meta/TikTok piksel verileri.
        </li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>Toplanan kişisel verileriniz, KVKK&apos;nın 4. maddesindeki genel ilkelere uygun olarak aşağıdaki amaçlarla işlenmektedir:</p>
      <ul>
        <li>
          <strong>Sözleşmenin Kurulması ve İfası:</strong> Üyelik işlemlerinin tamamlanması, siparişlerin alınması,
          tedarik edilmesi, paketlenmesi, faturalandırılması ve kargo/lojistik firmaları aracılığıyla adresinize
          teslim edilmesi.
        </li>
        <li>
          <strong>Müşteri Destek Süreçleri:</strong> Satış sonrası iptal, iade, değişim süreçlerinin yönetilmesi,
          ürünlere dair şikayet, öneri ve taleplerin değerlendirilmesi ve çözüme kavuşturulması.
        </li>
        <li>
          <strong>Finans ve Muhasebe İşlemleri:</strong> Ödemelerin tahsil edilmesi, muhasebe kayıtlarının
          tutulması, e-fatura/e-arşiv süreçlerinin yürütülmesi ve vergi mevzuatına uyum sağlanması.
        </li>
        <li>
          <strong>İşlem Güvenliği ve Mevzuata Uyum:</strong> 5651 sayılı Kanun kapsamında log kayıtlarının
          tutulması, siber güvenliğin sağlanması, dolandırıcılık (fraud) faaliyetlerinin engellenmesi ve yetkili
          kamu kurum ve kuruluşlarının yasal taleplerinin karşılanması.
        </li>
        <li>
          <strong>Pazarlama ve Reklam Faaliyetleri (Açık Rızanıza İstinaden):</strong> Ürün ve hizmetlerimizin
          beğeni ve kullanım alışkanlıklarınıza göre özelleştirilmesi; indirimler, yeni koleksiyonlar, özel
          çekilişler ve etkileşimli pazarlama aktiviteleri hakkında SMS, e-posta veya anlık bildirim yoluyla ticari
          elektronik ileti gönderilmesi; hedefleme ve yeniden pazarlama (re-marketing) reklamlarının yapılması.
        </li>
      </ul>

      <h2>4. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçlarla Aktarılabileceği</h2>
      <p>
        Dami, kişisel verilerinizi üçüncü kişilere satmaz veya kiralamaz. Verileriniz, yalnızca 3. maddede
        belirtilen amaçların gerçekleştirilmesi için KVKK&apos;nın 8. ve 9. maddelerine uygun olarak şu taraflara
        aktarılır:
      </p>
      <ul>
        <li>
          <strong>Kargo ve Lojistik Firmaları:</strong> Sipariş edilen ürünlerin gönderimi için ad, soyad, adres
          ve telefon bilgileriniz anlaşmalı kargo şirketlerine aktarılır.
        </li>
        <li>
          <strong>Ödeme ve Finans Kuruluşları:</strong> Ödeme işlemlerinin güvenli bir şekilde doğrulanması ve
          tahsil edilmesi amacıyla finansal verileriniz lisanslı sanal POS ve aracı ödeme altyapısı
          sağlayıcılarına aktarılır.
        </li>
        <li>
          <strong>Teknoloji ve Altyapı Sağlayıcıları:</strong> Web sitemizin barındırılması, e-ticaret altyapısı,
          ERP/muhasebe programları ve toplu e-posta/SMS gönderim sistemlerinin sunucularının kullanılması amacıyla
          ilgili yerli/yabancı altyapı sağlayıcılarına aktarılır.
        </li>
        <li>
          <strong>Yasal ve İdari Makamlar:</strong> Mahkemeler, Tüketici Hakem Heyetleri, Ticaret Bakanlığı ve
          Emniyet Genel Müdürlüğü gibi yetkili kurum ve kuruluşlara, hukuki yükümlülüklerimizin yerine
          getirilmesi amacıyla bilgi verilir.
        </li>
      </ul>

      <h2>5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebepleri</h2>
      <p>
        Kişisel verileriniz; web sitemiz üzerindeki formlar (üye kayıt formu, sipariş formu, iletişim formu,
        bülten aboneliği), pazar yeri entegrasyonları, çerezler (cookies) ve pikseller vasıtasıyla tamamen veya
        kısmen otomatik yollarla dijital ortamda toplanmaktadır.
      </p>
      <p>Kişisel verilerinizin işlenmesindeki hukuki sebepler KVKK Madde 5/2 uyarınca şunlardır:</p>
      <ul>
        <li><strong>Sözleşmenin kurulması veya ifası:</strong> Ürün satışı ve teslimatı süreçleri için zorunlu olması.</li>
        <li><strong>Hukuki yükümlülük:</strong> Vergi usul kanunu, e-ticaret mevzuatı ve log tutma zorunlulukları.</li>
        <li><strong>Meşru menfaat:</strong> Sitenin güvenliğinin sağlanması, performans analizi ve dolandırıcılığın önlenmesi.</li>
        <li><strong>Açık Rıza:</strong> Ticari elektronik ileti (pazarlama/reklam/kampanya) gönderimleri ve site dışı hedefli reklam piksellerinin kullanımı.</li>
      </ul>

      <h2>6. Veri Sahibi Olarak Haklarınız (KVKK Madde 11)</h2>
      <p>Kanun&apos;un 11. maddesi kapsamında, Dami&apos;ye başvurarak kendinizle ilgili şu hakları kullanabilirsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse bunların düzeltilmesini isteme,</li>
        <li>Kanun&apos;da öngörülen şartlar çerçevesinde verilerin silinmesini isteme,</li>
        <li>Düzeltme veya silme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
        <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
      </ul>

      <h2>7. Başvuru ve İletişim Yöntemi</h2>
      <p>
        Yukarıda belirtilen haklarınızı kullanmak için, kimliğinizi tespit edici gerekli bilgiler ile KVKK
        Madde 11&apos;de belirtilen haklardan hangisini kullanmak istediğinize dair net talebinizi içeren ıslak
        imzalı bir dilekçe ile <strong>{CONTACT_ADDRESS}</strong> adresimize yazılı olarak elden teslim edebilir, noter
        kanalıyla gönderebilir veya{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresine e-posta
        yoluyla iletebilirsiniz. Başvurularınız, talebin niteliğine göre en geç 30 (otuz) gün içinde
        ücretsiz olarak sonuçlandırılacaktır.
      </p>
    </LegalPageLayout>
  );
}
