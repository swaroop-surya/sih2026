import React from 'react';
import { useVolunteers } from '../../context/VolunteerContext';
import { VolunteerDetailSheet } from './VolunteerDetailSheet';
import { DirectChatModal } from './DirectChatModal';

export const GlobalVolunteerModals: React.FC = () => {
  const {
    selectedVolunteer,
    setSelectedVolunteer,
    openDirectChat,
    reportVol,
    blockVol
  } = useVolunteers();

  return (
    <>
      <VolunteerDetailSheet
        volunteer={selectedVolunteer}
        onClose={() => setSelectedVolunteer(null)}
        onOpenMessage={(v) => openDirectChat(v)}
        onReport={async (id, reason) => {
          await reportVol(id, reason);
        }}
        onBlock={async (id) => {
          await blockVol(id);
        }}
      />
      <DirectChatModal />
    </>
  );
};
