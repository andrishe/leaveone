-- 1. Activer RLS sur TOUTES les tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

-- 2. Politique : Users voient uniquement leur entreprise
CREATE POLICY "users_isolation" ON users
  FOR ALL
  USING (
    company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid
  );

-- 3. Politique : Leaves filtrées par company
CREATE POLICY "leaves_isolation" ON leaves
  FOR ALL
  USING (
    company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid
  );

-- 4. Politique : Managers voient uniquement leurs subordonnés
CREATE POLICY "manager_team_only" ON leaves
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE manager_id = auth.uid()
        AND company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid
    )
    OR user_id = auth.uid() -- Voir ses propres congés
  );

-- 5. Politique : Admin voit toute l'entreprise
CREATE POLICY "admin_full_access" ON leaves
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
        AND company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid
    )
  );
