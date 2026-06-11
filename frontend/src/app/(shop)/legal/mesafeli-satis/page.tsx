import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_RAW,
  SELLER_NAME,
  SELLER_VKN,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Mesafeli Satış & Üyelik Sözleşmesi — Dami Beauty",
};

export default function DistanceSalesPage() {
  return (
    <LegalPageLayout title="Mesafeli Satış Ön Bilgilendirme Formu & Üyelik Sözleşmesi">

      {/* ─── Ön Bilgilendirme Formu ─── */}
      <h2>Ön Bilgilendirme Formu</h2>

      <h3>1. Konu ve Kapsam</h3>
      <p>
        İşbu Ön Bilgilendirme Formu&apos;nun konusu, aşağıda nitelikleri ve satış fiyatı belirtilen ürünlerin
        satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 29188 sayılı
        Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca Alıcı&apos;nın (Tüketici) bilgilendirilmesidir.
        Alıcı, işbu formu onaylayarak, Mesafeli Satış Sözleşmesi&apos;nin kurulmasından önce Satıcı tarafından
        siparişe konu detaylar, ödeme ve teslimat koşulları hakkında eksiksiz olarak bilgilendirildiğini kabul eder.
      </p>

      <h3>2. Satıcı Bilgileri</h3>
      <ul>
        <li><strong>Ünvanı / Adı Soyadı:</strong> {SELLER_NAME} (Dami)</li>
        <li><strong>Adresi:</strong> {CONTACT_ADDRESS}</li>
        <li><strong>E-Posta:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Telefon:</strong> <a href={`tel:+${CONTACT_PHONE_RAW}`}>{CONTACT_PHONE_DISPLAY}</a></li>
        <li><strong>Vergi Kimlik Numarası (VKN):</strong> {SELLER_VKN}</li>
      </ul>

      <h3>3. Alıcı Bilgileri</h3>
      <p>
        Sipariş sırasında alıcıya ait ad-soyad, teslimat adresi, telefon ve e-posta bilgileri sipariş
        formundan alınmakta olup her sipariş için düzenlenen belgeye işlenmektedir.
      </p>

      <h3>4. Sözleşme Konusu Ürün Bilgileri ve Satış Bedeli</h3>
      <p>
        Sipariş konusu ürün/ürünlerin temel özellikleri (türü, miktarı, marka/modeli, rengi), vergiler dahil
        satış fiyatı ve kargo bilgileri sipariş özet sayfasında ve e-posta olarak iletilen sipariş
        onayında yer almaktadır. Tüm fiyatlar Türk Lirası (TRY) cinsindendir ve KDV dahildir.
      </p>

      <h3>5. Teslimat Bilgileri ve Şartları</h3>
      <p>
        Ürün(ler), yasal 30 (otuz) günlük süreyi aşmamak koşulu ile Alıcı&apos;nın adresine anlaşmalı kargo
        firması aracılığıyla teslim edilecektir. Kargo firmasının Alıcı&apos;nın bulunduğu bölgeye haftanın
        belirli günleri teslimat yapması veya siparişteki ürünün özelleştirilmiş/kampanyalı olması durumunda
        teslimat süresinde makul sarkmalar yaşanabilir.
      </p>
      <p>
        Ürün teslimatı sırasında paketin hasarlı (ezilmiş, yırtılmış, ıslanmış vb.) olması halinde Alıcı
        paketi teslim almamalı ve kargo yetkilisine &quot;Hasar Tespit Tutanağı&quot; tutturmalıdır.
      </p>

      <h3>6. Cayma Hakkı</h3>
      <p>
        Alıcı, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren{" "}
        <strong>14 (on dört) gün</strong> içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir
        gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma hakkının kullanılması için bu süre içinde
        Satıcı&apos;ya ait iletişim kanallarına (e-posta vb.) yazılı bildirimde bulunulması şarttır.
      </p>
      <p>
        Cayma hakkı kullanımı halinde, iade edilecek ürünlerin faturası, kutusu, ambalajı ve varsa standart
        aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir. İade kargo
        masrafları, Satıcı&apos;nın anlaşmalı olduğu kargo firmasının kullanılması şartıyla Satıcı&apos;ya aittir.
      </p>

      <h3>7. Cayma Hakkının Kullanılamayacağı Haller (Hijyen ve Kozmetik İstisnası)</h3>
      <p>
        Aşağıda belirtilen ürün gruplarında, Mesafeli Sözleşmeler Yönetmeliği madde 15/1-ç uyarınca cayma
        hakkı kullanılamaz:
      </p>
      <ul>
        <li>
          Tesliminden sonra koruyucu ambalajı, bandı, mührü veya paketi açılmış olan mallardan; iadesi sağlık
          ve hijyen açısından uygun olmayan ürünler.
        </li>
        <li>
          <strong>Kapsamdaki Ürünler:</strong> Press-on (takma) tırnaklar, dudak parlatıcıları (lip gloss),
          göz farı paletleri, makyaj fırçaları, tırnak yapıştırıcıları ve benzeri doğrudan ten ile temas eden
          tüm kozmetik ve kişisel bakım ürünleri. Bu ürünlerin ambalajı açıldığı veya ürün denendiği takdirde
          yasal iade hakkı geçersiz olur.
        </li>
        <li>
          Rastgele içerik prensibiyle satılan ambalajlı kampanyalı ürünlerde (Sürpriz Kaşık / Mystery Scoop
          vb.) ana ambalaj açıldıktan sonra iade işlemi yapılamaz.
        </li>
      </ul>

      <h3>8. Şikayet ve İtirazlar İçin Yetkili Merci</h3>
      <p>
        Alıcı, şikayet ve itirazları konusunda; Ticaret Bakanlığı tarafından her yıl Aralık ayında belirlenen
        parasal sınırlar dahilinde, Alıcı&apos;nın mal veya hizmeti satın aldığı veya ikametgahının bulunduğu
        yerdeki <strong>Tüketici Hakem Heyeti</strong>ne veya <strong>Tüketici Mahkemesi</strong>ne başvurabilir.
      </p>

      <hr />

      {/* ─── Üyelik Sözleşmesi ─── */}
      <h2>Dami Üyelik Sözleşmesi</h2>

      <h3>1. Taraflar</h3>
      <p>
        İşbu Üyelik Sözleşmesi (&quot;Sözleşme&quot;), bir tarafta <strong>{CONTACT_ADDRESS}</strong> adresinde mukim{" "}
        <strong>{SELLER_NAME} (Dami)</strong> (Bundan sonra &quot;Dami&quot; veya &quot;Şirket&quot; olarak
        anılacaktır) ile diğer tarafta Dami e-ticaret web sitesine (&quot;Site&quot;) üye olan internet kullanıcısı
        (&quot;Üye&quot;) arasında, Üye&apos;nin Site&apos;ye üye olması amacıyla ve Üyelik formunun doldurulduğu
        an yürürlüğe girmiştir.
      </p>

      <h3>2. Sözleşmenin Konusu</h3>
      <p>
        İşbu Sözleşme&apos;nin konusu, Dami&apos;ye ait olan e-ticaret web sitesinden Üye&apos;nin faydalanma,
        Site&apos;ye üye olma ve alışveriş yapma şartlarının, tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h3>3. Tarafların Hak ve Yükümlülükleri</h3>
      <ul>
        <li>
          <strong>3.1. Bilgilerin Doğruluğu:</strong> Üye, Site&apos;ye üye olurken verdiği kişisel ve diğer
          sair bilgilerin kanunlar önünde doğru olduğunu, Dami&apos;nin bu bilgilerin gerçeğe aykırılığı
          nedeniyle uğrayacağı tüm zararları aynen ve derhal tazmin edeceğini beyan ve taahhüt eder.
        </li>
        <li>
          <strong>3.2. Şifre Güvenliği:</strong> Üye, Dami tarafından kendisine verilmiş olan veya kendisinin
          belirlediği kullanıcı adı ve şifresini başka kişi ya da kuruluşlara veremez. Bu sebeple doğabilecek
          tüm sorumluluk ile üçüncü kişiler veya yetkili merciler tarafından Dami&apos;ye karşı ileri
          sürülebilecek tüm iddia ve taleplere karşı, Dami&apos;nin söz konusu izinsiz kullanımdan kaynaklanan
          her türlü tazminat ve sair talep hakkı saklıdır.
        </li>
        <li>
          <strong>3.3. Yasal Mevzuata Uyum:</strong> Üye, Site&apos;yi kullanırken yasal mevzuat hükümlerine
          riayet etmeyi ve bunları ihlal etmemeyi baştan kabul ve taahhüt eder.
        </li>
        <li>
          <strong>3.4. Sitenin Kamu Düzenine Uygun Kullanımı:</strong> Üye, Site&apos;yi hiçbir şekilde kamu
          düzenini bozucu, genel ahlaka aykırı, başkalarını rahatsız ve taciz edici şekilde, yasalara aykırı
          bir amaç için, başkalarının fikri ve telif haklarına tecavüz edecek şekilde kullanamaz.
        </li>
        <li>
          <strong>3.5. Fikri Mülkiyet Hakları:</strong> Sitede yer alan Dami markası, ürün tasarımları,
          logolar, metinler ve yazılımlar Dami&apos;ye ait olup telif hakkı mevzuatınca korunmaktadır; Üye
          tarafından izinsiz kullanılamaz, kopyalanamaz veya dağıtılamaz.
        </li>
        <li>
          <strong>3.6. Üyelik İptali:</strong> Dami, Üye&apos;nin işbu sözleşme hükümlerini ihlal etmesi,
          Site&apos;yi kötüye kullanması veya ticari güvenliği tehdit etmesi durumunda, Üye&apos;nin üyeliğini
          haklı bir nedenle tek taraflı olarak feshetme, dondurma veya silme hakkına sahiptir.
        </li>
      </ul>

      <h3>4. Gizlilik ve Kişisel Verilerin Korunması</h3>
      <p>
        Dami, Üye&apos;nin Site üzerinde paylaştığı kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması
        Kanunu&apos;na (&quot;KVKK&quot;) uygun olarak işlemektedir. Üye, kişisel verilerinin toplanması,
        işlenmesi ve aktarılması süreçlerine ilişkin detaylı bilgilere sitemizde yer alan{" "}
        <strong>KVKK Aydınlatma Metni</strong> ve <strong>Çerez Politikası</strong> üzerinden ulaşabilir.
      </p>
      <p>
        Üye, üyelik kaydı esnasında veya sonrasında rıza göstermiş olması halinde; Dami tarafından kendisine
        yeni koleksiyonlar, indirimler ve özel pazarlama aktivitelerine dair ticari elektronik iletiler (SMS,
        e-posta) gönderilmesini kabul etmiş sayılır. Üye, bu ticari iletileri alma onayını dilediği zaman
        ücretsiz olarak geri çekebilir.
      </p>

      <h3>5. Sözleşmenin Feshi</h3>
      <p>
        İşbu sözleşme Üye&apos;nin üyeliğini iptal etmesi veya Dami tarafından üyeliğinin iptal edilmesine
        kadar yürürlükte kalacaktır. Taraflar diledikleri zaman, herhangi bir gerekçe göstermeksizin sözleşmeyi
        tek taraflı olarak feshetme hakkına sahiptir.
      </p>

      <h3>6. Uyuşmazlıkların Çözümü</h3>
      <p>
        İşbu sözleşmeye ilişkin doğabilecek uyuşmazlıklarda, her yıl Ticaret Bakanlığı tarafından ilan edilen
        değere kadar <strong>Tüketici Hakem Heyetleri</strong> ile{" "}
        <strong>İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
      </p>

      <h3>7. Yürürlük</h3>
      <p>
        Üye&apos;nin üyelik kaydı yapması, üyenin üyelik sözleşmesinde yer alan tüm maddeleri okuduğu ve
        kabul ettiği anlamına gelir. İşbu Sözleşme üyenin üye olması anında akdedilmiş ve karşılıklı olarak
        yürürlüğe girmiştir.
      </p>
    </LegalPageLayout>
  );
}
