interface ParcelaPageProps {
  params: Promise<{ fazenda: string; talhao: string; parcela: string }>;
}

export default async function ParcelaPage({ params }: ParcelaPageProps) {
  const { fazenda, talhao, parcela } = await params;
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-verde-mata">Parcela: {parcela}</h2>
      <p className="text-verde-eucalipto mt-1">
        Talhão: {talhao} | Fazenda: {fazenda}
      </p>
      <p className="text-verde-eucalipto mt-2">Visualize e gerencie árvores desta parcela</p>
    </div>
  );
}
