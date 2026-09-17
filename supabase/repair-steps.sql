-- Restaure les étapes pour chaque candidat déjà créé.
-- Supabase → SQL Editor → Run

insert into steps (id, candidat_id, code, label, status, commentaire, position)
select gen_random_uuid(), c.id, t.code, t.label,
  case when t.position = 0 then 'en_cours' else 'a_faire' end,
  '',
  t.position
from candidats c
cross join (
  values
    ('orientation', 'Orientation académique', 0),
    ('programme', 'Choix du programme', 1),
    ('dossier', 'Préparation du dossier', 2),
    ('candidatures', 'Candidatures & demande admissions', 3),
    ('admission', 'Admission', 4),
    ('visa', 'Visa étudiant', 5),
    ('depart', 'Départ', 6),
    ('accompagnement', 'Accompagnement', 7)
) as t(code, label, position)
where not exists (
  select 1 from steps s
  where s.candidat_id = c.id and s.code = t.code
);

update steps s
set label = t.label,
    position = t.position
from (
  values
    ('orientation', 'Orientation académique', 0),
    ('programme', 'Choix du programme', 1),
    ('dossier', 'Préparation du dossier', 2),
    ('candidatures', 'Candidatures & demande admissions', 3),
    ('admission', 'Admission', 4),
    ('visa', 'Visa étudiant', 5),
    ('depart', 'Départ', 6),
    ('accompagnement', 'Accompagnement', 7)
) as t(code, label, position)
where s.code = t.code;
