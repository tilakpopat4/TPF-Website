'use client';

import React, { useState } from 'react';
import styles from '@/app/admin/page.module.css';
import AdminClientForm from '@/components/AdminClientForm';
import AdminMusicClientForm from '@/components/AdminMusicClientForm';
import AdminCastCrewClientForm from '@/components/AdminCastCrewClientForm';
import AdminPosterClientForm from '@/components/AdminPosterClientForm';
import AdminAnnouncementClientForm from '@/components/AdminAnnouncementClientForm';
import AdminBTSClientForm from '@/components/AdminBTSClientForm';
import AdminSpotifyForm from '@/components/AdminSpotifyForm';
import AdminLatestCreationForm from '@/components/AdminLatestCreationForm';
import AdminVisionForm from '@/components/AdminVisionForm';
import AdminYouTubeChannelForm from '@/components/AdminYouTubeChannelForm';

interface AdminDashboardViewProps {
  projects: any[];
  music: any[];
  crew: any[];
  posters: any[];
  announcements: any[];
  bts: any[];
  spotifyUrl: string;
  visionLogoUrl: string;
  visionLogoLightUrl: string;
  visionTagline: string;
  latestCreationUrl: string;
  latestCreationTitle: string;
  youtubeHandle: string;
  youtubeApiKey: string;
  youtubeSubscribers: string;
  youtubeVideoCount: string;
}

type TabKey = 'all' | 'projects' | 'visuals' | 'audio' | 'news';

export default function AdminDashboardView({
  projects,
  music,
  crew,
  posters,
  announcements,
  bts,
  spotifyUrl,
  visionLogoUrl,
  visionLogoLightUrl,
  visionTagline,
  latestCreationUrl,
  latestCreationTitle,
  youtubeHandle,
  youtubeApiKey,
  youtubeSubscribers,
  youtubeVideoCount,
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const tabs: { key: TabKey; label: string; icon: string; count?: number }[] = [
    { key: 'all', label: 'All Modules', icon: '⚡' },
    { key: 'projects', label: 'Cinema & Projects', icon: '🎬', count: projects.length + bts.length },
    { key: 'visuals', label: 'Cast, Posters & Vision', icon: '🎨', count: crew.length + posters.length },
    { key: 'audio', label: 'Music & Spotify', icon: '🎵', count: music.length },
    { key: 'news', label: 'Channel & News', icon: '📢', count: announcements.length },
  ];

  return (
    <div className={styles.dashboardContainer}>
      
      {/* ─── Top Stats Bar ─── */}
      <div className={styles.statsOverview}>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{projects.length}</span>
          <span className={styles.statLabel}>Featured Films</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{crew.length}</span>
          <span className={styles.statLabel}>Cast & Crew</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{posters.length}</span>
          <span className={styles.statLabel}>Poster Designs</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{music.length}</span>
          <span className={styles.statLabel}>Music Tracks</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{bts.length}</span>
          <span className={styles.statLabel}>BTS Episodes</span>
        </div>
        <div className={`${styles.statCard} glass`}>
          <span className={styles.statNumber}>{announcements.length}</span>
          <span className={styles.statLabel}>Announcements</span>
        </div>
      </div>

      {/* ─── Interactive Navigation Tabs ─── */}
      <div className={styles.categoryNav}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${styles.categoryTabBtn} ${activeTab === tab.key ? styles.categoryTabBtnActive : ''}`}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabText}>{tab.label}</span>
            {tab.count !== undefined && <span className={styles.tabBadge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ─── Spacious Cards Grid ─── */}
      <div className={`${styles.grid} ${activeTab !== 'all' ? styles.gridFocused : ''}`}>
        
        {/* Vision / TPF Cinemas Section */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🎥</div>
              <div>
                <h2>TPF Cinemas — Vision &amp; Logos</h2>
                <p className={styles.cardDescription}>
                  Configure dark/light branding logos and tagline for the TPF Cinemas &ldquo;An OTT For Beginners&rdquo; vision page.
                </p>
              </div>
            </div>
            <AdminVisionForm 
              currentLogoUrl={visionLogoUrl} 
              currentLogoLightUrl={visionLogoLightUrl} 
              currentTagline={visionTagline} 
            />
          </section>
        )}

        {/* YouTube Channel Settings Section */}
        {(activeTab === 'all' || activeTab === 'news') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🔴</div>
              <div>
                <h2>Official YouTube Channel Settings</h2>
                <p className={styles.cardDescription}>
                  Configure your YouTube channel handle, real-time metrics, subscriber counts, and API key.
                </p>
              </div>
            </div>
            <AdminYouTubeChannelForm 
              currentHandle={youtubeHandle} 
              currentApiKey={youtubeApiKey}
              currentSubscribers={youtubeSubscribers}
              currentVideoCount={youtubeVideoCount}
            />
          </section>
        )}

        {/* Latest Creation Section */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🎬</div>
              <div>
                <h2>Latest Creation (Homepage Showcase)</h2>
                <p className={styles.cardDescription}>
                  Set the featured widescreen hero creation video to display prominently below the brand header.
                </p>
              </div>
            </div>
            <AdminLatestCreationForm 
              currentUrl={latestCreationUrl} 
              currentTitle={latestCreationTitle} 
            />
          </section>
        )}

        {/* Projects Section */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className={`${styles.card} glass ${styles.cardWide}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>📽️</div>
              <div>
                <h2>Featured Portfolio Projects</h2>
                <p className={styles.cardDescription}>
                  Manage major cinematic releases, thumbnails, trailers, release schedules, and sequence order.
                </p>
              </div>
            </div>
            <AdminClientForm initialProjects={projects} />
          </section>
        )}

        {/* Behind The Scenes Section */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🎞️</div>
              <div>
                <h2>Behind The Scenes (BTS)</h2>
                <p className={styles.cardDescription}>
                  Upload behind-the-scenes footage, on-set documentaries, and production thumbnails.
                </p>
              </div>
            </div>
            <AdminBTSClientForm btsItems={bts} />
          </section>
        )}

        {/* Cast & Crew Section */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <section className={`${styles.card} glass ${styles.cardWide}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>👥</div>
              <div>
                <h2>Cast &amp; Crew Roster</h2>
                <p className={styles.cardDescription}>
                  Manage creative team members, director profiles, actor headshots, and credits order.
                </p>
              </div>
            </div>
            <AdminCastCrewClientForm initialCrew={crew} />
          </section>
        )}

        {/* Poster Section */}
        {(activeTab === 'all' || activeTab === 'visuals') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🖼️</div>
              <div>
                <h2>Cinematic Poster Designs</h2>
                <p className={styles.cardDescription}>
                  Upload high-resolution marketing key art, character posters, and artwork downloads.
                </p>
              </div>
            </div>
            <AdminPosterClientForm initialPosters={posters} />
          </section>
        )}

        {/* Music Section */}
        {(activeTab === 'all' || activeTab === 'audio') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>🎼</div>
              <div>
                <h2>TPF Music &amp; Audio Tracks</h2>
                <p className={styles.cardDescription}>
                  Manage original soundtracks, background scores, MP3 uploads, and album key-art.
                </p>
              </div>
            </div>
            <AdminMusicClientForm initialMusic={music} />
          </section>
        )}

        {/* Spotify Settings Section */}
        {(activeTab === 'all' || activeTab === 'audio') && (
          <section className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>💚</div>
              <div>
                <h2>Featured Spotify Embed</h2>
                <p className={styles.cardDescription}>
                  Set the primary Spotify playlist, single, or artist stream displayed on the Music portal.
                </p>
              </div>
            </div>
            <AdminSpotifyForm currentUrl={spotifyUrl} />
          </section>
        )}

        {/* Announcements Section */}
        {(activeTab === 'all' || activeTab === 'news') && (
          <section className={`${styles.card} glass ${styles.cardWide}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>📰</div>
              <div>
                <h2>Studio News &amp; Announcements</h2>
                <p className={styles.cardDescription}>
                  Publish official production updates, casting calls, festival screenings, and press releases.
                </p>
              </div>
            </div>
            <AdminAnnouncementClientForm initialAnnouncements={announcements} />
          </section>
        )}

      </div>
    </div>
  );
}
