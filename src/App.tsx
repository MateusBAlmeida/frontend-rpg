import { useRef, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area"
import { Shield, Sword, Heart, Brain, Eye, Smile, Dumbbell, BookText, PenLine, Download } from "lucide-react";
import html2pdf from 'html2pdf.js';

export default function GeradorFicha() {
  type Ficha = {
    raca: string;
    classe: string;
    atributos: Record<string, number>;
    modificadores: Record<string, number>;
    habilidades_raciais: string[];
  };
  
  const [ficha, setFicha] = useState<Ficha | null>(null);
  
  const [loading, setLoading] = useState(false);

  const fichaRef = useRef<HTMLDivElement>(null);

  const gerarFicha = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ficha-rpg-puq8.onrender.com/generate");
      const data = await response.json();
      setFicha(data);
    } catch (error) {
      console.error("Erro ao gerar ficha:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    if (fichaRef.current) {
      html2pdf().from(fichaRef.current).set({
        margin: 0.5,
        filename: 'ficha-personagem-'+ficha?.raca+'-'+ficha?.classe+'.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      }).save();
    }
  };

  const atributoIcones: Record<string, JSX.Element> = {
    Força: <Dumbbell className="inline w-5 h-5 mr-1" />,
    Destreza: <Shield className="inline w-5 h-5 mr-1" />,
    Constituição: <Heart className="inline w-5 h-5 mr-1" />,
    Inteligência: <BookText className="inline w-5 h-5 mr-1" />,
    Sabedoria: <Eye className="inline w-5 h-5 mr-1" />,
    Carisma: <Smile className="inline w-5 h-5 mr-1" />,
  };

  return (
    <div className="min-h-screen bg-stone-400 bg-[url('/fundo.png')] bg-fill bg-center text-white p-6">
      <div className="max-w-4xl mx-auto text-center p-4">
        <h1 className="text-4xl font-bold mb-8 tracking-wide uppercase">Ficha de Personagem</h1>
        <div className="flex justify-center gap-4 mb-8">
        <Button onClick={gerarFicha} disabled={loading} className="mb-8 text-lg bg-stone-800 hover:bg-stone-500 rounded">
          {loading ? "Gerando..." : "Gerar Nova Ficha"}
        </Button>
        {ficha && (
            <Button onClick={exportarPDF} variant="secondary" className="mb-8 text-lg bg-stone-800 hover:bg-stone-500 rounded">
              <Download className="w-4 h-4 mr-2" /> Exportar PDF
            </Button>
          )}
        </div>
        {ficha && (
          <ScrollArea className="rounded-md bg-[url('/papel-antigo.jpg')] bg-local bg-cover bg-center shadow-xl p-6">
            <div ref={fichaRef} className="grid gap-6 text-left text-black font-serif">
              <section className="border-b border-stone-600 pb-4">
                <h2 className="text-2xl font-bold mb-2 border-l-4 border-black pl-2">Identidade</h2>
                <p className="mb-1"><span className="font-semibold">Raça:</span> {ficha.raca}</p>
                <p><span className="font-semibold">Classe:</span> {ficha.classe}</p>
              </section>

              <section className="border-b border-stone-600 pb-4">
                <h2 className="text-2xl font-bold mb-2 border-l-4 border-black pl-2">Atributos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(ficha.atributos).map(([atrib, valor]) => (
                    <div key={atrib} className="p-3 rounded-lg text-center shadow-inner border border-yellow-700">
                      <div className="text-lg font-bold uppercase">
                        {atributoIcones[atrib]}{atrib}
                      </div>
                      <div className="text-2xl">{valor}</div>
                      <div className="text-sm text-stone-600">Mod: {ficha.modificadores[atrib]}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-b border-stone-600 pb-4">
                <h2 className="text-2xl font-bold mb-2 border-l-4 border-black pl-2">Habilidades Raciais</h2>
                <ul className="list-disc list-inside space-y-1">
                  {ficha.habilidades_raciais.map((hab, i) => (
                    <li key={i}>{hab}</li>
                  ))}
                </ul>
              </section>

              {/* <section className="pt-4">
                <h2 className="text-2xl font-bold mb-2 border-l-4 border-black pl-2 flex items-center gap-2">
                  <PenLine className="w-5 h-5" /> Assinatura do Jogador
                </h2>
                <div className="h-12 border-b border-line border-gray-700 w-2/3"></div>
              </section> */}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
