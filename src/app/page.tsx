import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 py-16 text-center md:px-12 lg:px-24 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Terapist Rehberi'ne Hoş Geldiniz
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Size en uygun terapisti bulmanıza yardımcı oluyoruz. Profesyonel terapistlerle tanışın ve ruh sağlığınız için ilk adımı atın.
            </p>
            <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Terapist Bul
                  <span className="ml-2" aria-hidden="true">→</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Terapist Olarak Katıl
                  <span className="ml-2" aria-hidden="true">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Güvenilir Terapistler
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tüm terapistlerimiz lisanslı ve deneyimlidir.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Kolay Randevu
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Birkaç tıklama ile size uygun saatte randevu alın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Online Görüşme
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dilediğiniz yerden online terapi seanslarına katılın.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 