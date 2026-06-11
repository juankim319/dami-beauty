import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { CONTACT_EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası — Dami Beauty",
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout title="Dami İptal ve İade Politikası">
      <p>
        Dami olarak, müşteri memnuniyetini en üst düzeyde tutmayı hedefliyoruz. Ancak yasal zorunluluklar ve
        özellikle kozmetik/kişisel bakım ürünlerinin doğası gereği dikkat etmemiz gereken hijyen kuralları
        bulunmaktadır. Sipariş iptali ve ürün iade süreçlerimiz, Türkiye Cumhuriyeti e-ticaret mevzuatına uygun
        olarak aşağıda detaylandırılmıştır.
      </p>

      <h2>1. Sipariş İptali</h2>
      <p>
        Fikrinizi değiştirmeniz veya yanlış bir sipariş vermeniz durumunda, siparişiniz kargoya teslim edilmeden
        önce iptal talebinde bulunabilirsiniz.
      </p>
      <p>
        <strong>Nasıl İptal Edebilirim?</strong> Siparişiniz henüz &quot;Kargoya Verildi&quot; statüsüne
        geçmediyse,{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresimize sipariş
        numaranız ile birlikte e-posta göndererek iptal talebinizi iletebilirsiniz.
      </p>
      <p>
        <strong>Ücret İadesi:</strong> İptal edilen siparişlerin ödeme iadesi, kullandığınız ödeme yöntemine
        bağlı olarak 1 ila 7 iş günü içerisinde bankanıza/kredi kartınıza eksiksiz olarak yansıtılacaktır.
      </p>

      <h2>2. Cayma Hakkı ve İade Şartları</h2>
      <p>
        Alıcı, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren <strong>14
        (on dört) gün</strong> içerisinde hiçbir gerekçe göstermeksizin siparişinden cayma ve ürünleri iade
        etme hakkına sahiptir.
      </p>
      <p><strong>İade Edilecek Ürünlerde Aranan Temel Şartlar:</strong></p>
      <ul>
        <li>Ürün(ler) kullanılmamış, hasar görmemiş ve orijinal ambalajı bozulmamış olmalıdır.</li>
        <li>
          İade işlemi, ürünün faturası (veya e-arşiv faturası çıktısı), tüm aksesuarları ve varsa hediye
          ürünleri ile birlikte eksiksiz olarak yapılmalıdır.
        </li>
        <li>
          İade kargo gönderimleri, sitemizde belirtilen veya müşteri hizmetlerimizce size iletilecek olan
          anlaşmalı kargo firmamız üzerinden yapılmalıdır. Anlaşmalı olmadığımız kargo firmaları ile gönderilen
          &quot;Karşı Ödemeli&quot; iadeler kabul edilmeyecektir.
        </li>
      </ul>

      <h2>3. Cayma Hakkının Geçerli Olmadığı Durumlar (ÖNEMLİ)</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi (1-ç bendi) gereğince, sağlık ve hijyen açısından
        iadesi uygun olmayan ürünlerde cayma hakkı kullanılamaz. Dami bünyesinde satılan ürünlerin büyük bir
        kısmı kişisel bakım ve doğrudan ten/cilt temaslı ürünler olduğu için aşağıdaki şartlarda kesinlikle
        iade kabul edilmemektedir:
      </p>
      <ul>
        <li>
          <strong>Açılmış Kozmetik ve Bakım Ürünleri:</strong> Press-on tırnaklar, tırnak yapıştırıcıları,
          dudak parlatıcıları (lip gloss), far paletleri, makyaj fırçaları ve benzeri tüm ürünlerin koruyucu
          güvenlik bandı, şeffaf ambalajı veya kutu mühürleri açıldığı, yırtıldığı veya denendiği takdirde
          yasal iade hakkı ortadan kalkar.
        </li>
        <li>
          <strong>Sürpriz Kaşık / Gizemli Paket Kampanyaları:</strong> İçeriği rastgele belirlenerek paketlenen
          sürpriz konseptli satışlarda, paket içeriği açılıp görüldükten sonra &quot;çıkan renkleri/ürünleri
          kişisel olarak beğenmeme&quot; sebebiyle iade yapılamaz. Bu ürünlerde iade hakkı, yalnızca ana güvenlik
          ambalajı hiç açılmamışsa 14 gün içinde kullanılabilir.
        </li>
        <li>
          <strong>Kişiselleştirilmiş Ürünler:</strong> Alıcının özel talepleri doğrultusunda hazırlanan veya
          üzerinde değişiklik yapılan ürünler.
        </li>
      </ul>

      <h2>4. Kusurlu (Ayıplı) Ürün İadeleri ve Kargo Hasarları</h2>
      <p>
        Size ulaşan ürünün üretimden kaynaklı kusurlu olması durumunda 14 günlük süre zarfında ürün değişimi
        veya iadesi talep edebilirsiniz.
      </p>
      <p>
        <strong>Kargo Hasarı Durumunda:</strong> Siparişinizi kargo görevlisinden teslim alırken paketi kontrol
        etmeniz gerekmektedir. Kutu üzerinde ezilme, yırtılma veya akma gibi bir hasar tespit ederseniz, paketi
        teslim almayarak kargo görevlisine &quot;Hasar Tespit Tutanağı&quot; tutturmalısınız. Tutanak tutulmayan
        kargo hasarlarında yasal sorumluluk alıcıya geçmektedir.
      </p>

      <h2>5. İade Süreci Nasıl İşler?</h2>
      <ul>
        <li>
          <strong>Talep Oluşturma:</strong> İade etmek istediğiniz ürün(ler) için sipariş numaranız ve iade
          nedeninizi belirterek{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresimize bir
          e-posta gönderin.
        </li>
        <li>
          <strong>Onay ve Kargo Kodu:</strong> Talebiniz incelendikten sonra tarafınıza iade onayı ve anlaşmalı
          kargo gönderi kodu iletilecektir.
        </li>
        <li>
          <strong>Kargolama:</strong> Ürünleri, faturasıyla birlikte güvenli bir şekilde paketleyerek
          belirttiğimiz kargo firmasına teslim edin.
        </li>
        <li>
          <strong>İnceleme ve İade:</strong> İade kargonuz depomuza/ofisimize ulaştığında hijyen ve ambalaj
          kontrollerinden geçer. Şartlara uygun olan iadelerin ücret iadesi işlemi 3 iş günü içinde başlatılır.
          İade tutarının hesabınıza geçmesi, bankanızın süreçlerine bağlı olarak 2-7 iş günü sürebilir.
        </li>
      </ul>
    </LegalPageLayout>
  );
}
