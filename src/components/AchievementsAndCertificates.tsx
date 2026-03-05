'use client';

import { Achievement, Certificate } from '@/types';

interface AchievementsAndCertificatesProps {
  achievements: Achievement[];
  certificates: Certificate[];
}

export default function AchievementsAndCertificates({
  achievements,
  certificates,
}: AchievementsAndCertificatesProps) {
  return (
    <div className="space-y-8">
      {/* Achievements Section */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-4">🏆 Achievements & Badges</h3>
        
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-cyan-500/30 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="font-bold text-slate-100 text-sm">{achievement.title}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{achievement.description}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 text-center">
            <p className="text-slate-400">No achievements yet. Start learning to earn badges! 🚀</p>
          </div>
        )}
      </div>

      {/* Certificates Section */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-4">📜 Certificates</h3>
        
        {certificates && certificates.length > 0 ? (
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-gradient-to-r from-amber-600/10 to-yellow-600/10 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between hover:border-amber-500/50 transition-all"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-100">{cert.pathTitle}</p>
                  <p className="text-sm text-slate-400">
                    Completed: {new Date(cert.earnedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Certificate #: {cert.certificateNumber}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // In a real app, this would download/view the certificate
                    alert(`Viewing certificate for "${cert.pathTitle}"\nNumber: ${cert.certificateNumber}`);
                  }}
                  className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 rounded-lg font-semibold text-sm transition-all ml-4"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 text-center">
            <p className="text-slate-400">No certificates yet. Complete courses to earn certificates! 🎓</p>
          </div>
        )}
      </div>
    </div>
  );
}
