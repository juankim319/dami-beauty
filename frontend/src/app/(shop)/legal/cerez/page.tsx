import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_RAW,
  SELLER_NAME,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Çerez Politikası — Dami Beauty",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Çerez (Cookie) Politikası">

      <h2>1. Giriş</h2>
      <p>
        Dami (Resul Gündoğdu) olarak, web sitemizi ziyaret eden kullanıcılarımızın deneyimini geliştirmek,
        sitemizin verimli çalışmasını sağlamak ve hizmetlerimizi kişiselleştirmek amacıyla çerezler (cookies)
        ve benzeri takip teknolojileri kullanmaktayız. İşbu Çerez Politikası, web sitemizde hangi tür
        çerezlerin kullanıldığını, bu çerezlerin kullanım amaçlarını ve kullanıcıların bu çerezleri nasıl
        yönetebileceğini açıklamak amacıyla 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
        uyarınca hazırlanmıştır.
      </p>

      <h2>2. Çerez (Cookie) Nedir?</h2>
      <p>
        Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar,
        akıllı telefon, tablet vb.) kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin
        cihazınızı tanımasını, alışveriş sepetinizi hatırlamasını ve siteyi daha güvenli ve hızlı
        kullanmanızı sağlar.
      </p>

      <h2>3. Sitemizde Kullanılan Çerez Türleri ve Kullanım Amaçları</h2>
      <p>
        Web sitemizde ve e-ticaret altyapımızda (sepet ve ödeme aşamaları dahil) işlevlerine göre aşağıdaki
        çerez türleri kullanılmaktadır:
      </p>
      <ul>
        <li>
          <strong>A. Zorunlu (Temel) Çerezler:</strong> Sitemizin düzgün çalışması, güvenliğin sağlanması
          ve e-ticaret işlevlerinin (örneğin, sepete eklenen ürünlerin ödeme sayfasına kadar saklanması,
          üye girişi yapılması) yerine getirilmesi için kesinlikle gerekli olan çerezlerdir. Bu çerezler
          devre dışı bırakılamaz; aksi takdirde siteden alışveriş yapılamaz.
        </li>
        <li>
          <strong>B. İşlevsel Çerezler:</strong> Sitemizi tekrar ziyaret ettiğinizde dil tercihlerinizi,
          üyelik bilgilerinizi veya önceki seçimlerinizi hatırlayarak size daha kişiselleştirilmiş bir
          deneyim sunmak için kullanılan çerezlerdir.
        </li>
        <li>
          <strong>C. Performans ve Analitik Çerezler:</strong> Ziyaretçilerin sitemizi nasıl kullandığını,
          hangi sayfaların daha çok ilgi gördüğünü ve sitemizin performansını ölçmek için kullandığımız
          çerezlerdir. Bu veriler tamamen anonim olarak toplanır ve site içi hataları giderip kullanıcı
          deneyimini iyileştirmemizi sağlar.
        </li>
        <li>
          <strong>D. Pazarlama ve Reklam Çerezleri (Pikseller):</strong> İlgi alanlarınıza uygun ürünleri
          ve kampanyaları size sunabilmek amacıyla kullanılır. Sosyal medya platformları (TikTok,
          Meta/Facebook, Instagram vb.) ve reklam ağları ile entegre çalışır. Kampanyalarımız, yeni
          koleksiyonlarımız ve özel satış kurgularımız hakkında site dışında özelleştirilmiş reklamlar
          (yeniden pazarlama) göstermemizi sağlar. Açık rızanıza tabi olarak çalışırlar.
        </li>
      </ul>

      <h2>4. Çerezlerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Çerezler, sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla otomatik olarak toplanmaktadır.
      </p>
      <ul>
        <li>
          <strong>Zorunlu çerezler;</strong> &quot;bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya
          ilgili olması&quot; ve &quot;veri sorumlusunun meşru menfaati&quot; hukuki sebeplerine dayalı olarak
          işlenmektedir.
        </li>
        <li>
          <strong>Analitik, İşlevsel ve Pazarlama/Reklam çerezleri</strong> ise web sitemize ilk girişinizde
          karşınıza çıkan çerez uyarı paneli (banner) üzerinden vereceğiniz &quot;Açık Rıza&quot;ya dayalı
          olarak işlenmektedir.
        </li>
      </ul>

      <h2>5. Çerezleri Nasıl Yönetebilir veya Silebilirsiniz?</h2>
      <p>
        Sitemizi ziyaret ettiğinizde karşınıza çıkan Çerez Yönetim Paneli üzerinden çerez tercihlerinizi
        dilediğiniz zaman değiştirebilir, Zorunlu Çerezler dışındaki çerezleri açıp kapatabilirsiniz.
      </p>
      <p>
        Bunun yanı sıra, tarayıcınızın ayarlarını değiştirerek çerezlere ilişkin tercihlerinizi
        kişiselleştirme imkanına sahipsiniz:
      </p>
      <ul>
        <li><strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve diğer site verileri</li>
        <li><strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Web Sitesi Verilerini Yönet</li>
        <li><strong>Mozilla Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri</li>
      </ul>
      <p>
        Tarayıcı ayarlarınızdan Zorunlu Çerezleri silmeniz veya engellemeniz durumunda, web sitemizdeki
        e-ticaret süreçlerinin (sepete ürün ekleme, ödeme yapma) düzgün çalışmayabileceğini hatırlatmak
        isteriz.
      </p>

      <h2>6. İletişim</h2>
      <p>Çerez Politikamız ve kişisel verilerinizin işlenmesi ile ilgili her türlü soru, talep ve şikayetiniz için:</p>
      <ul>
        <li><strong>Veri Sorumlusu:</strong> {SELLER_NAME} (Dami)</li>
        <li><strong>Adres:</strong> {CONTACT_ADDRESS}</li>
        <li>
          <strong>E-Posta:</strong>{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
        <li>
          <strong>Telefon:</strong>{" "}
          <a href={`tel:+${CONTACT_PHONE_RAW}`}>{CONTACT_PHONE_DISPLAY}</a>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
