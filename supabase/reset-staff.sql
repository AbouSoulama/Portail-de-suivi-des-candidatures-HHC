-- Vide tous les dossiers / comptes, puis recrée les 2 conseillers.
-- Supabase → SQL Editor → Run

delete from steps;
delete from candidats;
delete from users;

insert into users (id, identifiant, password_hash, role, prenom, nom)
values
  (
    '026fb8dc-a25d-456e-8ab8-89f0b8e50ac5',
    'MHO2026',
    '$2b$10$kSGfVv3tbk9mccq0cV3sT.iL0mRO/qdenzns1tx4r5MaQgCToQPeW',
    'admin',
    'Hamine',
    'OUEDRAOGO'
  ),
  (
    '96db59f7-54f5-4393-ac9f-bdc1f3308825',
    'MAS2026',
    '$2b$10$9LL5AVsmKE2dzBqCMWiUGuImsFBrrVv/eFPghqC0frLCGfc9zbscu',
    'admin',
    'Minon Aboubacar',
    'SOULAMA'
  );
