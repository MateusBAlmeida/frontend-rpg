import { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from "./components/ui/button";

export default function GeradorFicha() {
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(false);

  const gerarFicha = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/generate");
      const data = await response.json();
      setFicha(data);
    } catch (error) {
      console.error("Erro ao gerar ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 text-white p-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Gerador de Fichas - Old Dragon 2</h1>
        <Button className='bg-gray-900 rounded hover:bg-white hover:text-gray-900' onClick={gerarFicha} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Ficha"}
        </Button>

        {ficha && (
          <Card className="mt-6 text-left bg-gray-900 border text-white border-gray-700">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{ficha.raca} {ficha.classe}</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ficha.atributos).map(([atrib, valor]) => (
                  <div key={atrib}>
                    <strong>{atrib}:</strong> {valor} ({ficha.modificadores[atrib]})
                  </div>
                ))}
              </div>
              <h3 className="mt-4 font-semibold">Habilidades Raciais:</h3>
              <ul className="list-disc list-inside">
                {ficha.habilidades_raciais.map((hab, i) => (
                  <li key={i}>{hab}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

