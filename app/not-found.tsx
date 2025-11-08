import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página No Encontrada</h2>
        <p className="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
        <Link 
          href="/home"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
