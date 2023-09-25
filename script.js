    // Add event listeners for tab and enter keys
    document.addEventListener("keydown", function(event) {
        if (event.key === "Tab" && event.target.tagName !== "SELECT") {
            event.preventDefault();
            // Manually handle tab key press to focus on the next input
            const inputs = document.querySelectorAll("input, select, button");
            const currentInput = event.target;
            const currentIndex = Array.from(inputs).indexOf(currentInput);
            const nextIndex = currentIndex + 1 < inputs.length ? currentIndex + 1 : 0;
            inputs[nextIndex].focus();
        } else if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
            event.preventDefault();
            // Manually handle enter key press to trigger a button click
            const buttons = document.querySelectorAll("button");
            const currentButton = event.target;
            if (buttons.includes(currentButton)) {
                currentButton.click();
            }
        }
    });

    // Function to handle CSV import
    function importCSV() {
        const csvFileInput = document.getElementById("csvFile");
        const file = csvFileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                const lines = contents.split("\n");

                for (const line of lines) {
                    const data = line.split(",");
                    if (data.length >= 5) {
                        // Assuming CSV format: Vorname, Nachname, Username, Email, Teams
                        const vorname = data[0].trim();
                        const nachname = data[1].trim();
                        const username = data[2].trim();
                        const email = data[3].trim();
                        const teams = data[4].trim();

                        // Create a new user container and populate input fields
                        addUserContainerWithValues(vorname, nachname, username, email, teams);
                    }
                }
            };

            reader.readAsText(file);
        }
    }
// container for adding new user divs from imported CSV
    let userCount = 0;
    function addUserContainerWithValues(vorname, nachname, username, email, teams) {
        userCount++;
        const userContainers = document.getElementById("userContainers");
        const newUserContainer = document.createElement("div");
        newUserContainer.className = "user-container";
        newUserContainer.innerHTML = `
            <span>${userCount}.</span> <!-- Zeilennummer -->
            <input type="text" placeholder="Vorname" value="${vorname}" oninput="capitalizeFirstLetter(this)">
            <input type="text" placeholder="Nachname" value="${nachname}" oninput="capitalizeFirstLetter(this)">
            <input type="text" placeholder="Username" value="${username}" oninput="lowercaseAll(this)">
            <input type="text" placeholder="Email" value="${email}" oninput="lowercaseAll(this)">
            <input type="text" placeholder="Teams" value="${teams}">
        `;
        userContainers.appendChild(newUserContainer);
    }
// container for adding new user divs manually
    function addUserContainer() {
        userCount++;
        const userContainers = document.getElementById("userContainers");
        const newUserContainer = document.createElement("div");
        newUserContainer.className = "user-container";
        newUserContainer.innerHTML = `
            <span>${userCount}.</span> <!-- Zeilennummer -->
            <input type="text" placeholder="Vorname">
            <input type="text" placeholder="Nachname">
            <input type="text" placeholder="Username">
            <input type="text" placeholder="Email">
            <input type="text" placeholder="Teams">
        `;
        userContainers.appendChild(newUserContainer);
    }

    function replaceVariables(script, umgebung, anlagetyp, mandant, rolle, layout, recht, rolle_dms3, auth_dms3, fachprofil_dms3) {
        script = script.replace(/__UMGEBUNG/g, umgebung);
        script = script.replace(/__SKRIPTNAME/g, anlagetyp);
        script = script.replace(/__USER/g, mandant);
        script = script.replace(/__Sachanalge/g, mandant);
        script = script.replace(/__rolle/g, rolle);
        script = script.replace(/__layout/g, layout);
        script = script.replace(/__recht/g, recht);
        script = script.replace(/__authdms3/g, auth_dms3);
        script = script.replace(/__dms3rolle/g, rolle_dms3);
        script =script.replace(/__fachprofildms3/g, fachprofil_dms3)
        return script;
    }
// Function to check if conditions are met to generate SQL file

function checkDropdownsAndGenerateSQL() {
            const umgebungDropdown = document.getElementById("umgebungDropdown");
            const anlagetypDropdown = document.getElementById("anlagetypDropdown");
            const mandantDropdown = document.getElementById("mandantDropdown");
            const checkbox1 = document.getElementById("functionCheckbox1");
            const checkbox2 = document.getElementById("functionCheckbox2");
            const checkbox3 = document.getElementById("functionCheckbox3");
            const userContainers = document.querySelectorAll(".user-container");

            // Check if any dropdown has a value of 99 and is therefore not selected
            if (
                umgebungDropdown.value === "99" ||
                anlagetypDropdown.value === "99" ||
                mandantDropdown.value === "99"
            ) {
                // Alert the user to select an option for each dropdown
                alert("Bitte wählen Sie eine Umgebung, Anlagetypen und Mandanten.");
                return;
            }
            // Alert the user to add at least one user
            if (userContainers.length === 0) {
                alert("Bitte fügen Sie mindestens einen Benutzer hinzu.");
                return;
            }
            // check if no checkboxes are ticked and alert if none are, else generate SQL Script
            if (!checkbox1.checked && !checkbox2.checked && !checkbox3.checked)
            {
                alert("Bitte wählen Sie eine der Skripttypen.");
                return;
            }
             else {
                // All dropdowns and Checkboxes have valid selections, proceed to generate SQL script
                generateSQLScripts();
            }
        }
// function to capitalize first letters in Name and surname inputs
   function capitalizeFirstLetter(inputField) {
        let inputText = inputField.value;
        if (inputText.length > 0) {
            inputField.value = inputText.charAt(0).toUpperCase() + inputText.slice(1);
        }
    }
// function to lower all letters in Email and username inputs
    function lowercaseAll(inputField) {
        let inputText = inputField.value;
        if (inputText.length > 0) {
            inputField.value = inputText.toLowerCase();
        }
    }
   // Function that generates SQL Scripts from entered values and predefinded parts of the script
        function generateSQLScripts() {
            const umgebungDropdown = document.getElementById("umgebungDropdown");
            const anlagetypDropdown = document.getElementById("anlagetypDropdown");
            const mandantDropdown = document.getElementById("mandantDropdown");
            const umgebung = umgebungDropdown.value;
            const anlagetyp = anlagetypDropdown.value;
            const mandant = mandantDropdown.value;
            let input;
            let rolle = "";
            let layout = "";
            let recht = "";
            let rolle_dms3 ="";
            let auth_dms3 = "";
            let fachprofil_dms3 = "";
            const checkbox1 = document.getElementById("functionCheckbox1");
            const checkbox2 = document.getElementById("functionCheckbox2");
            const checkbox3 = document.getElementById("functionCheckbox3");

            let script1 = "";
            let script2 = "";
            let script3 = "";

            if (anlagetypDropdown.value === "SachAnlage" )
              {
                rolle = "Sachbearbeiter";
                layout = "Sachbearbeiter_Layout";
                recht = "Sachbearbeiter_Recht";
                rolle_dms3 = "('Abzeichnung', 'eIndex Modul',                                      'PUBLIC', 'Sachbearbeiter')";
                auth_dms3 = "Dms3LdapAuthorization";
                fachprofil_dms3 = "(profile_type='D' and name='FHH-Sachbearbeitung_Dokumente') or (profile_type='A' and name='FHH-Sachbearbeitung_Akten')";
              }

              if (anlagetypDropdown.value === "Administration" )
              {
                rolle = "Administration";
                layout = "$OTS_Standard_Layout";
                recht = "$OTS_Standard_AllesW";
                rolle_dms3 = "('Administratoren',                                                  'PUBLIC')";
                auth_dms3 = "Dms3ShaAuthorization";
                fachprofil_dms3 = "(profile_type='D' and name='FHH-Admin') or (profile_type='A' and name='FHH_Standard')";
              }

              if (anlagetypDropdown.value === "Geschaeftsfuehrung" )
              {
                rolle = "Führungskräfte";
                layout = "Führungskräfte_Layout";
                recht = "Führungskräfte_Recht";
                rolle_dms3 = "('Abzeichnung', 'eIndex Modul', 'Führungskräfte', 'Geschäftszimmer', 'PUBLIC', 'Sachbearbeiter')";
                auth_dms3 = "Dms3LdapAuthorization";
                fachprofil_dms3 = "(profile_type='D' and name='FHH-Sachbearbeitung_Dokumente') or (profile_type='A' and name='FHH-Sachbearbeitung_Akten')";
              }
              const rolle_value = rolle;
              const layout_value = layout;
              const recht_value = recht;
              const auth_dms3_value = auth_dms3;
              const rolle_dms3_value = rolle_dms3;
              const fachprofil_dms3_value = fachprofil_dms3;

            if (checkbox1.checked) {
                script1 = `
--Beginn Standardkopf "Ausführung für EINEN Mandanten" 
--Version 2.0
set echo on
set feedback on
set serveroutput on

--Für den Skriptautomat des TVM, damit das richtige log befüllt wird und es 1 log je Mandant gibt
--Variablen für Umgebung, Schema und Skriptname änderbar. Bitte keine Leerzeichen verwenden.\n
DEFINE UMGEBUNG: __UMGEBUNG;\n
DEFINE USER = G2VB__USER;\n
DEFINE SKRIPTNAME: __SKRIPTNAME;\n\n

set termout off
col DATUM new_value DATUM
select to_char(sysdate,'YYYYMMDDHH24MISS') DATUM from dual;
set termout on
spool &_UMGEBUNG._&_SKRIPTNAME._&_USER._&DATUM..log

--Es folgen Standardausgaben, damit man das logfile auch später noch zuordnen kann
select name Datenbankname from v$database;
select host_name from v$instance;
select * from v$version where banner like 'Oracle%';
select dbms_utility.port_string from dual;
select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') "SYSTIMESTAMP" from dual;
show user
--äöü§€=²³
--Ende Standardkopf "Ausführung für EINEN Mandanten" 

/*
** Veränderte Tabellen:  (ETeam_Personen),   (ETeam_Result),   IDENT_USERADR,   ST_ULR_USER_ROLLEN,   IDENT_USERROLES,   IDENT_USERTEAM
*/

--Beginn Skriptbody
/***********************************************************************************************/

-- G2VB-Skript zur Anlage von Sachbearbeitern

DROP TABLE ETeam_Personen CASCADE CONSTRAINTS;
CREATE TABLE ETeam_Personen (zeile NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
                             nummer NUMBER, username VARCHAR(255), vorname VARCHAR(255), nachname VARCHAR(255), email VARCHAR(255), teams VARCHAR(255), leer VARCHAR(255));


/* HIER DIE LISTE ERSETZEN  */
--INSERT INTO ETeam_Personen (nummer,vorname,nachname,email,username,teams,leer) VALUES (00, 'Vorname',  'Name',         'Email',                                    'User',          'Team', 'Bereich'                                           );\n`;

            }

            if (checkbox2.checked) {
				script2 = `
--Beginn Standardkopf "Ausführung für EINEN Mandanten" 
--Version 2.0
set echo on
set feedback on
set serveroutput on

--Für den Skriptautomat des TVM, damit das richtige log befüllt wird und es 1 log je Mandant gibt
--Variablen für Umgebung, Schema und Skriptname änderbar. Bitte keine Leerzeichen verwenden.\n
DEFINE _UMGEBUNG: __UMGEBUNG;\n
DEFINE _USER = DMS3__USER;\n
DEFINE _SKRIPTNAME: __SKRIPTNAME;\n\n
set termout off
col DATUM new_value DATUM
select to_char(sysdate,'YYYYMMDDHH24MISS') DATUM from dual;
set termout on
spool &_UMGEBUNG._&_SKRIPTNAME._&_USER._&DATUM..log

--Es folgen Standardausgaben, damit man das logfile auch später noch zuordnen kann
select name Datenbankname from v$database;
select host_name from v$instance;
select * from v$version where banner like 'Oracle%';
select dbms_utility.port_string from dual;
select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') "SYSTIMESTAMP" from dual;
show user
--äöü§€=²³
--Ende Standardkopf "Ausführung für EINEN Mandanten" 

/*
** Veränderte Tabellen:  (ETeam_Personen),   (ETeam_Result),   ST_USER,   ST_USER_OPTIONS,   USER_ROLE,   USER_SPECIALISEDMENUEPROFILE
*/

--Beginn Skriptbody
/***********************************************************************************************/

-- DMS3-Skript zur Anlage von Sachbearbeitern

DROP TABLE ETeam_Personen CASCADE CONSTRAINTS;
CREATE TABLE ETeam_Personen (zeile NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
                             nummer NUMBER, username VARCHAR(255), vorname VARCHAR(255), nachname VARCHAR(255), email VARCHAR(255), teams VARCHAR(255), leer VARCHAR(255));


/* HIER DIE LISTE ERSETZEN  */
--INSERT INTO ETeam_Personen (nummer,vorname,nachname,email,username,teams,leer) VALUES (00, 'Vorname',  'Name',         'Email',                                    'User',          'Team', 'Bereich'                                           );\n`;
            }

            if (checkbox3.checked) {
				script3 = `
set echo on
set feedback on
set serveroutput on\n
DEFINE _UMGEBUNG: __UMGEBUNG;\n
DEFINE _USER = DMS3__USER;\n
DEFINE _SKRIPTNAME: __SKRIPTNAME;\n\n
set termout off
col DATUM new_value DATUM
select to_char(sysdate,'YYYYMMDDHH24MISS') DATUM from dual;
set termout on
spool &_UMGEBUNG._&_SKRIPTNAME._&_USER._&DATUM..log

--Es folgen Standardausgaben, damit man das logfile auch später noch zuordnen kann

select name Datenbankname from v$database;
select host_name from v$instance;
select * from v$version where banner like 'Oracle%';
select dbms_utility.port_string from dual;
select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') from dual;
show user

--äöü§€=²³
/*
** Veränderte Tabellen:  (ETeam_Personen),   (ETeam_Result),   IDENT_USERADR,   ST_ULR_USER_ROLLEN,   IDENT_USERROLES,   IDENT_USERTEAM
*/

--Beginn Skriptbody
/***********************************************************************************************/

-- DMS3-Skript zur Anlage von Fachdienststellen\n`;
            }
            //generate SQL Files depending on which checkboxes are ticked 
            const users = document.getElementsByClassName("user-container");

            for (const user of users) {
                const inputs = user.querySelectorAll("input");
                const vorname = inputs[0].value;
                const nachname = inputs[1].value;
                const username = inputs[2].value;
                const email = inputs[3].value;
                const teams = inputs[4].value;

                if (checkbox1.checked) {
                    script1 += `INSERT INTO ETeam_Personen (VORNAME, NACHNAME, USERNAME, EMAIL, TEAMS) ('${username}', '${nachname}', '${username}', '${email}', '${teams}');\n`;
                }

                if (checkbox2.checked) {
                    script2 += `INSERT INTO ETeam_Personen (VORNAME, NACHNAME, USERNAME, EMAIL, TEAMS) ('${username}', '${nachname}', '${username}', '${email}', '${teams}');\n`;
                }

                if (checkbox3.checked) {
                    script3 += `INSERT INTO ST_USER values ((select max(id)+1 from st_user),lower('${username}'),'03zNRqLIxrX/95mRz0s59GGEuvlJHv0ZjiH30/Ud7G8=','720',null,'KEINE',null,null,'N',null,null,'N','N','1',null,null,null,sysdate,null,'${teams}',null,'ETEAM_MASSENANLAGE',null,null,null,null,null,null,null,null,null,null,sysdate,'82ithP2XlpgIVi7Cevmifw==','Y','N',0,'${vorname}','${nachname}',1000,'Dms3LdapAuthorization',null,null,null);\n`;
                }
            }

            if (checkbox1.checked) {
				script1 += `
DROP TABLE ETeam_Result CASCADE CONSTRAINTS;
CREATE TABLE ETeam_Result (zeile NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
                           listline NUMBER, username VARCHAR2(255), errtext VARCHAR2(4000));

DECLARE
  v_zeile     ETeam_Personen.zeile%TYPE;
  v_username  ETeam_Personen.username%TYPE;
  v_vorname   ETeam_Personen.vorname%TYPE;
  v_nachname  ETeam_Personen.nachname%TYPE;
  v_email     ETeam_Personen.email%TYPE;
  v_teams     ETeam_Personen.teams%TYPE;
  v_telefon   CONSTANT VARCHAR(255) := '';
  v_user_id   integer;
  i           integer;
  v_errmsg    VARCHAR2(4000);
  CURSOR person_cursor IS SELECT zeile, username, vorname, nachname, email, teams FROM ETeam_Personen ORDER BY zeile;
BEGIN
  COMMIT;
  OPEN person_cursor;
  LOOP
    FETCH person_cursor INTO v_zeile, v_username, v_vorname, v_nachname, v_email, v_teams;
    EXIT WHEN person_cursor%NOTFOUND;
    BEGIN
      INSERT INTO ETeam_Result ( listline, username ) VALUES (v_zeile, v_username);
      SAVEPOINT start_transaction;
      DBMS_OUTPUT.PUT_LINE(''); DBMS_OUTPUT.PUT_LINE(''); DBMS_OUTPUT.PUT_LINE('');
      DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||': '||v_username||' wird bearbeitet.');
-------- Beginn Riesenscript "02_G2VBXX_Admin_User.sql"
-- ENDE KONFIG Bereich
  i:=0;
  DBMS_OUTPUT.enable(1000000);
  v_username:=lower(v_username);

INSERT INTO IDENT_USERADR (USER_ID, USERNAME, NAME, VORNAME, 
    TELEFON, EMAIL, AKTIV, BENUTZERKENNUNG,
    DMS_ADRESSABGLEICH, MODDAT, MODIFIER)
select t.* from(
  select nvl(max(user_id),0)+1 USER_ID, v_username USERNAME, v_nachname NAME, v_vorname PRENAME,
         v_telefon PHONE, v_email EMAIL, 1 AKTIV, v_username BENUTZERKENNUNG,
         1 DMS_ADRESSABGLEICH, sysdate MODDAT, 'ots-service' MODIFIER
  from IDENT_USERADR)t
WHERE t.USERNAME not in(select USERNAME from IDENT_USERADR);
i:=sql%rowcount;
--commit;
select USER_ID into v_user_id from IDENT_USERADR where USERNAME=v_username;
DBMS_OUTPUT.PUT_LINE('#1 Benutzer '||v_username||' angelegt mit user_id='||v_user_id||', rows='||i);
 
INSERT INTO ST_ULR_USER_ROLLEN 
  (ID, IDENT_USER_ID, ULR_ROLLEN_ID, 
   MODIFIER, MODDAT)
select t.* from
  (select ur.max_Id+rownum ID, v_user_id IDENT_USER_ID, r.ULR_ROLLEN_ID, 
          'ots-service' MODIFIER, sysdate MODDAT
   FROM
     (select nvl(max(id),0) MAX_ID from ST_ULR_USER_ROLLEN)ur,
     (select id ULR_ROLLEN_ID from st_ulr_rollen where kuerzel in
('__recht','__layout')r)t
   where (t.ident_User_id, t.ulr_rollen_id) not in (select ident_User_id,ulr_rollen_id from ST_ULR_USER_ROLLEN);
-- ^^^ Einstellung: OTS Rollenzuordnungen ^^^
-- Führungskräfte = ('Führungskräfte_Layout','Führungskräfte_Recht')
-- Sachbearbeiter = ('Sachbearbeiter_Layout','Sachbearbeiter_Recht')
-- Administration = ('$OTS_Standard_AllesW' ,'$OTS_Standard_Layout')
-- ^^^^^
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE('#2 Plus Rollen/Layout zugeordnet, rows='||i);
 
INSERT INTO IDENT_USERROLES
  (ID, USER_ID, ROLE_ID,
   MODDAT, MODIFIER)
select t.* from
  (select ur.max_Id+rownum ID, v_user_id USER_ID, r.role_Id,
          sysdate MODDAT, 'ots-service' MODIFIER 
   FROM
     (select nvl(max(id),0) MAX_ID from IDENT_USERROLES)ur,
     (select id role_Id from ident_roles where rolename='__rolle';
)r)t
where (t.user_Id, t.role_id) not in (select user_id,role_id from IDENT_USERROLES);
-- ^^^ Einstellung: G2VB Rollenzuordnung ^^^
-- 'Sachbearbeiter'
-- 'Führungskräfte'
-- 'Administration'
-- ^^^^^
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE('#3 Klassik Rolle zugeordnet, rows='||i);

INSERT INTO ident_userteam (id, user_id, team_id,  modifier, moddat)
SELECT x.* FROM
  (SELECT ut.max_Id+ROWNUM id, v_user_id user_id, t.team_id, 'ots-service' modifier, SYSDATE moddat
   FROM (SELECT NVL(MAX(id),1) max_id FROM ident_userteam)ut,
        (SELECT id team_id FROM ident_team WHERE name
         IN (SELECT TRIM(REGEXP_SUBSTR(v_teams, '[^,]+', 1, level)) FROM dual
             CONNECT BY REGEXP_SUBSTR(v_teams, '[^,]+', 1, level) IS NOT NULL))t
   )x
WHERE (x.user_id, x.team_id) NOT IN (SELECT user_id, team_id FROM ident_userteam);
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE('#4 Teams zugeordnet, rows='||i);

-------- Ende Riesenscript "02_G2VBXX_Admin_User.sql"
      COMMIT;
      DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||': '||v_username||' wurde erfolgreich eingefügt.');
      UPDATE ETeam_Result SET errtext = 'success' WHERE listline = v_zeile;
      -- EXIT;
    EXCEPTION
      WHEN OTHERS THEN
        ROLLBACK TO start_transaction;
        DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||'  '||v_username||' konnte aufgrund eines Fehlers nicht eingefügt werden:');
        v_errmsg := TO_CHAR(SQLERRM(SQLCODE));
        DBMS_OUTPUT.PUT_LINE(v_errmsg);
        UPDATE ETeam_Result SET errtext = v_errmsg WHERE listline = v_zeile;
    END;
  END LOOP;
  CLOSE person_cursor;
END;
/

DECLARE
  v_result    VARCHAR2(4000) := '';
BEGIN
  SELECT listagg(zeile||';'||username||';'||errtext,chr(10)) into v_result FROM ETeam_Result;
  DBMS_OUTPUT.PUT_LINE('#5 Resultate '||chr(10)||v_result);
END;
/

/***********************************************************************************************/
--Ende Skriptbody

--Beginn Standardfuß Version 1.0

select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') "SYSTIMESTAMP" from dual;
spool off

--Ende Standardfuß`;
script1 = replaceVariables(script1, umgebung, anlagetyp, mandant, rolle_value, recht_value, layout_value, auth_dms3_value, rolle_dms3_value, fachprofil_dms3);;
                downloadScript(script1, "G2VB+-Skript.sql");
            }

            if (checkbox2.checked) {
				script2 += `
DROP TABLE ETeam_Result CASCADE CONSTRAINTS;
CREATE TABLE ETeam_Result (zeile NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
                           listline NUMBER, username VARCHAR2(255), errtext VARCHAR2(4000));

DECLARE
  v_zeile     ETeam_Personen.zeile%TYPE;
  v_username  ETeam_Personen.username%TYPE;
  v_vorname   ETeam_Personen.vorname%TYPE;
  v_nachname  ETeam_Personen.nachname%TYPE;
  v_email     ETeam_Personen.email%TYPE;
  v_teams     ETeam_Personen.teams%TYPE;
  v_telefon   CONSTANT VARCHAR(255) := '';
  v_user_id   integer;
  i           integer;
  v_errmsg    VARCHAR2(4000);
  CURSOR person_cursor IS SELECT zeile, username, vorname, nachname, email, teams FROM ETeam_Personen ORDER BY zeile;
BEGIN
  COMMIT;
  OPEN person_cursor;
  LOOP
    FETCH person_cursor INTO v_zeile, v_username, v_vorname, v_nachname, v_email, v_teams;
    EXIT WHEN person_cursor%NOTFOUND;
    BEGIN
      INSERT INTO ETeam_Result ( listline, username ) VALUES (v_zeile, v_username);
      SAVEPOINT start_transaction;
      DBMS_OUTPUT.PUT_LINE(''); DBMS_OUTPUT.PUT_LINE(''); DBMS_OUTPUT.PUT_LINE('');
      DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||': '||v_username||' wird bearbeitet.');
-------- Beginn Riesenscript "01_DMS3XX_Admin_User.sql"
-- ENDE KONFIG Bereich
  i:=0;
  DBMS_OUTPUT.enable(1000000);
  v_username:=lower(v_username);
 
INSERT INTO ST_USER (ID, LOGIN, PWD, 
    TIMEOUT, DOMAINNAME, EMAIL, PHONE,
    LOCKED, CHARGE_FEE, REQUEST_FORM, LOCATION_ID,
    LAST_PWD_UPDATE, LAST_LOGIN, PWD_SALT, 
    PWD_TEMPORARY, SYS, PRENAME, SECNAME,
    ORGANIZATION_UNIT, AUTH_PROVIDER)
select t.* from(
  select nvl(max(id),0)+1 ID, v_username LOGIN, 'DPK2YxbGkH2mqN+gdl5nkUikORSDVrG4Q1THYE9TXl8=' PWD,
         480 TIMEOUT, 'KEINE' DOMAINNAME, v_email EMAIL, v_telefon PHONE,
         'X' LOCKED, 'N' CHARGE_FEE, 'N' REQUEST_FORM, 1 LOCATION_ID,
         sysdate LAST_PWD_UPDATE, sysdate LAST_LOGIN, 'HVJMieZ1+B1/WNDxcd5v8Q==' PWD_SALT,
         'Y' PWD_TEMPORARY, 'N' SYS, v_vorname PRENAME, v_nachname SECNAME,
         1000 ORGANIZATION_UNIT, 
'__dms3rolle'
         AUTH_PROVIDER
  from ST_USER)t
WHERE t.login not in(select login from ST_USER);
-- ^^^ Einstellung: Auth-Provider (SHA/LDAP) ^^^
-- Administration: 'Dms3ShaAuthorization'
-- Alle anderen:   'Dms3LdapAuthorization'
-- ^^^^^
i:=sql%rowcount;
--commit;
select id into v_user_id from st_user where login=v_username;
DBMS_OUTPUT.PUT_LINE('#1 Benutzer '||v_username||' angelegt mit user_id='||v_user_id||', rows='||i);

-- USER OPION 'XFERMODE'=XferApp+
INSERT INTO st_user_options
            (USER_ID, OPTION_NAME, OPTION_VALUE, LAST_WRITE)
SELECT t.* from
  (SELECT
     v_user_id USER_ID, 'XFER_MODE' OPTION_NAME, '4' OPTION_VALUE, sysdate LAST_WRITE
   FROM dual)t
WHERE (t.user_id, t.OPTION_NAME) not in(select user_Id, option_Name from st_user_options);
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE('#2 ST_USER_OPTION Eintrag erstellt, rows='||i);

-- ROLLEN ZUORDNUNG relevante Admin Rollen
--> To Do: hier werden nur Rollen hinzugefügt aber bestehende werden nicht gelöscht. Löschung muss hinzugefügt werden.
INSERT INTO USER_ROLE (USER_ID, ROLLE_ID)
select t.* from
	(select v_user_id user_id, r.rolle_id from
		(select id rolle_Id from st_role where description in
__authdms3
		 )r)t
where (t.user_Id, t.rolle_Id) not in(select user_Id,rolle_id from user_role);
-- ^^^ Einstellung DSM3 Rollenzuordnung ^^^
-- Führungskräfte: ('Abzeichnung', 'eIndex Modul', 'Führungskräfte', 'Geschäftszimmer', 'PUBLIC', 'Sachbearbeiter')
-- Sachbearbeiter: ('Abzeichnung', 'eIndex Modul',                                      'PUBLIC', 'Sachbearbeiter')
-- Administration: ('Administratoren',                                                  'PUBLIC')
-- ^^^^^
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE('#3 Rollenzuordnung durchgeführt, rows='||i);

-- DOKUMENT FACHPROFIL ZUORDNUNG - FHH_Admin
INSERT INTO USER_SPECIALISEDMENUEPROFILE
            (USER_ID, SPECIALISEDMENUEPROFILE_ID, PROFILE_TYPE)
select t.* from
            (select
  v_user_id user_Id, s.SPECIALISEDMENUEPROFILE_ID, s.profile_type from
  (select id SPECIALISEDMENUEPROFILE_ID, profile_type from st_SPECIALISEDMENUEPROFILE where
(profile_type='D' and name='FHH-Sachbearbeitung_Dokumente') or (profile_type='A' and name='FHH-Sachbearbeitung_Akten')
    )s)t
where (t.user_id, t.profile_type) not in(select user_id, profile_type from USER_SPECIALISEDMENUEPROFILE);
i:=sql%rowcount;
--commit;
DBMS_OUTPUT.PUT_LINE __fachprofildms3;
-- ^^^ Einstellung: Fachprofile ^^^
-- Administration: (profile_type='D' and name='FHH-Admin') or (profile_type='A' and name='FHH_Standard')
-- Alle anderen:   (profile_type='D' and name='FHH-Sachbearbeitung_Dokumente') or (profile_type='A' and name='FHH-Sachbearbeitung_Akten')
-- ^^^^^

-------- Ende Riesenscript "01_DMS3XX_Admin_User.sql"
      COMMIT;
      DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||': '||v_username||' wurde erfolgreich eingefügt.');
      UPDATE ETeam_Result SET errtext = 'success' WHERE listline = v_zeile;
      -- EXIT;
    EXCEPTION
      WHEN OTHERS THEN
        ROLLBACK TO start_transaction;
        DBMS_OUTPUT.PUT_LINE('Nr.'||v_zeile||'  '||v_username||' konnte aufgrund eines Fehlers nicht eingefügt werden:');
        v_errmsg := TO_CHAR(SQLERRM(SQLCODE));
        DBMS_OUTPUT.PUT_LINE(v_errmsg);
        UPDATE ETeam_Result SET errtext = v_errmsg WHERE listline = v_zeile;
    END;
  END LOOP;
  CLOSE person_cursor;
END;
/

DECLARE
  v_result    VARCHAR2(4000) := '';
BEGIN
  SELECT listagg(zeile||';'||username||';'||errtext,chr(10)) into v_result FROM ETeam_Result;
  DBMS_OUTPUT.PUT_LINE('#5 Resultate '||chr(10)||v_result);
END;
/

/***********************************************************************************************/
--Ende Skriptbody

--Beginn Standardfuß Version 1.0

select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') "SYSTIMESTAMP" from dual;
spool off

--ende Standardfuß`
script2 = replaceVariables(script2, umgebung, anlagetyp, mandant, rolle_value, recht_value, layout_value, auth_dms3_value, rolle_dms3_value, fachprofil_dms3);;
                downloadScript(script2, "DMS3-Skript.sql");
            }

            if (checkbox3.checked) {
				script3 += `
--INSERT INTO ST_USER values((select max(id)+1 from st_user),lower('##BENUTZERNAME##'),'03zNRqLIxrX/95mRz0s59GGEuvlJHv0ZjiH30/Ud7G8=','720',null,'KEINE',null,null,'N',null,null,'N','N','1',null,null,null,sysdate,null,'##ZEICHEN DER DIENSTSTELLE##',null,'ETEAM_MASSENANLAGE',null,null,null,null,null,null,null,null,null,null,sysdate,'82ithP2XlpgIVi7Cevmifw==','Y','N',0,'##VORNAME##','##NACHNAME##',1000,'Dms3LdapAuthorization',null,null,null);
commit;

-- USER OPION 'EMBEDDED_MODE'
INSERT INTO st_user_options
SELECT u.id,'EMBEDDED_MODE','true',SYSDATE FROM st_user u WHERE compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

-- USER OPION 'XFERMODE'
INSERT INTO st_user_options
SELECT u.id,'XFER_MODE','3',SYSDATE FROM st_user u WHERE compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

-- ROLLEN ZUORDNUNG 'Fachdienststellen'
INSERT INTO USER_ROLE
select u.id,(select id from st_role where description = 'Fachdienststellen') from st_user u where compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

-- DOKUMENT FACHPROFIL ZUORDNUNG
INSERT INTO USER_SPECIALISEDMENUEPROFILE
select u.id,(select id from st_SPECIALISEDMENUEPROFILE where NAME = 'Oktagon-Fachdienststelle'),'D' from st_user u where compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

-- AKTEN FACHPROFIL ZUORDNUNG
INSERT INTO USER_SPECIALISEDMENUEPROFILE
select u.id,(select id from st_SPECIALISEDMENUEPROFILE where NAME = 'FHH-Sachbearbeitung_Akten'),'A' from st_user u where compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

-- ENTFERNEN von Marker für Massenanlage
UPDATE ST_USER set compartment_mail = null where compartment_mail = 'ETEAM_MASSENANLAGE';
commit;

select TO_CHAR (SYSTIMESTAMP, 'dd.mm.yyyy hh24:mi:ss.ff') from dual;
spool off\n`;
script3 = replaceVariables(script3, umgebung, anlagetyp, mandant, rolle_value, recht_value, layout_value, auth_dms3_value, rolle_dms3_value, fachprofil_dms3);
                downloadScript(script3, "DMS3-Dienststellenanlage-Skript.sql");
            }
        }
        //function to automatically download the created files, this is used by the generateSQL function for the download of each script
        function downloadScript(content, filename) {
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
