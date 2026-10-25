'use client';
import { useParams, useRouter } from 'next/navigation';
import { getP1Track } from '@/lib/p1-curriculum-data';
import { P1ActivityRunner } from '@/components/P1ActivityRunner';
import { TamaCharacter } from '@/components/TamaCharacter';

export default function P1SchoolTrackPage() {
  const params = useParams<{ trackId: string }>();
  const router = useRouter();
  const track = getP1Track(params.trackId);

  if (!track) {
    return (
      <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-5 p-8">
        <TamaCharacter size={140} uniform />
        <p className="text-white font-black text-lg text-center">That class is not on the timetable!</p>
        <button
          onClick={() => router.push('/p1-school')}
          className="bg-white text-tama-ink font-black px-6 py-3 rounded-2xl shadow text-lg"
        >
          🎒 Back to P1 School
        </button>
      </main>
    );
  }

  return <P1ActivityRunner key={track.id} track={track} />;
}
