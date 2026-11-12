# Aanpassingen aan de T-Rex Runner

Het origineel is het dinospel uit Google Chrome dat je krijgt als je geen internet hebt. Ik heb het spel op vier punten aangepast. Alle wijzigingen staan in `index.js` en zijn in de code te vinden met de zoekterm `AANPASSING`.

| # | Aanpassing | Wat het doet |
|---|------------|--------------|
| 1 | Sprongsnelheid werkt echt | De instelling `INITIAL_JUMP_VELOCITY` wordt nu ook echt gebruikt |
| 2 | Dubbele sprong | In de lucht kun je nog één keer springen |
| 3 | Levens | Je hebt 3 levens. Pas na 3 botsingen is het game over |
| 4 | Opgeslagen highscore | Je highscore blijft bewaard, ook nadat je de pagina sluit |

---

## Hoe het spel werkt (basis)

Het spel draait in een **game loop**: de functie `Runner.update()` wordt ongeveer 60 keer per seconde aangeroepen via `requestAnimationFrame`. In elke ronde (*frame*) gebeurt het volgende:

1. Het canvas wordt leeggemaakt.
2. De positie van de dino, de wolken en de obstakels wordt bijgewerkt.
3. Het spel controleert of de dino een obstakel raakt (*collision detection*, botsingsdetectie).
4. Alles wordt opnieuw getekend.

De variabele `deltaTime` is de tijd in milliseconden sinds het vorige frame. Het spel rekent daarmee, zodat het op een trage en een snelle computer even snel loopt.

---

## Aanpassing 1: de sprongsnelheid werkt echt

**Probleem:** in `Runner.config` stond `INITIAL_JUMP_VELOCITY: 100`, maar dat getal had **geen enkel effect**. De dino gebruikt namelijk zijn eigen instelling `Trex.config.INIITAL_JUMP_VELOCITY` (met een typfout in de naam, `INIITAL`). De waarde uit `Runner.config` werd alleen doorgegeven als je hem tijdens het spel veranderde.

**Oplossing:** in `Runner.init()` geef ik de waarde direct door aan de dino:

```js
this.tRex.setJumpVelocity(this.config.INITIAL_JUMP_VELOCITY);
```

`setJumpVelocity` maakt het getal negatief, omdat op een canvas de y-as **naar beneden** loopt: y = 0 is de bovenkant. Omhoog bewegen betekent dus dat y kleiner wordt.

Ik heb de waarde op **12** gezet in plaats van 100. Bij 100 zou de dino al in het eerste frame 100 pixels omhoog schieten, terwijl het hele canvas maar 150 pixels hoog is. 12 is iets hoger dan het origineel (10), zodat de dubbele sprong lekker speelt.

---

## Aanpassing 2: dubbele sprong

**Idee:** als de dino al in de lucht is, mag je nog één keer op spatie drukken om opnieuw omhoog te gaan.

**Hoe:**
- De dino houdt een teller bij: `airJumps` (het aantal sprongen in de lucht).
- In `onKeyDown` staat een extra voorwaarde:

```js
} else if (this.tRex.jumping && !e.repeat &&
    this.tRex.airJumps < this.config.MAX_AIR_JUMPS) {
    this.tRex.airJump(this.currentSpeed);
}
```

  Dus: de dino springt al, het is een **nieuwe** toetsdruk (`e.repeat` is `true` als je de toets alleen ingedrukt houdt) en het maximum is nog niet bereikt.
- `airJump()` zet de snelheid weer omhoog, net als bij een gewone sprong, en verhoogt de teller met 1.
- In `reset()`, als de dino weer op de grond staat, gaat `airJumps` terug naar 0.
- **Plafond:** bij het testen vloog de dino met een dubbele sprong boven het scherm uit (y = −30). Daarom staat in `updateJump()` nu een check: als `yPos < 0`, dan wordt `yPos = 0` en stopt de stijging.

Met `MAX_AIR_JUMPS` in de config kun je instellen hoeveel extra sprongen er mogen (0 = origineel spel).

---

## Aanpassing 3: levens

**Idee:** in plaats van meteen game over heb je 3 levens. Linksboven zie je een hartje per leven.

**Hoe:**
- Nieuwe variabelen: `this.lives` (begint op `LIVES` = 3) en `this.invincibleTimer`.
- Bij een botsing gaat er eerst een leven af:

```js
this.lives--;
if (this.lives > 0) {
    this.loseLife();
} else {
    this.gameOver();
}
```

- `loseLife()` speelt het botsingsgeluid af, haalt het geraakte obstakel weg (`removeFirstObstacle`) en maakt de dino **1,5 seconde onkwetsbaar**. Zonder die onkwetsbaarheid zou je in hetzelfde obstakel meteen alle levens tegelijk verliezen, omdat de botsing elk frame opnieuw wordt gedetecteerd.
- Tijdens die onkwetsbaarheid **knippert** de dino. In `Trex.draw()` wordt om de 100 ms de doorzichtigheid (`globalAlpha`) op 0,3 gezet. Dat gebeurt met `Math.floor(tijd / 100) % 2`: dit is afwisselend 0 en 1.
- `drawLives()` tekent met `fillText` een ♥ per leven op het canvas.
- Bij `restart()` worden de levens weer op 3 gezet.

---

## Aanpassing 4: highscore opslaan

**Probleem:** in het origineel is je highscore weg zodra je de pagina herlaadt, omdat hij alleen in een variabele staat (in het werkgeheugen).

**Oplossing:** de highscore wordt opgeslagen in **`localStorage`**. Dat is een kleine opslagplaats in de browser die blijft bestaan na het sluiten van de pagina.
- `saveHighScore()` gebruikt `localStorage.setItem(...)` bij game over, als je een nieuwe highscore hebt.
- `loadHighScore()` leest met `localStorage.getItem(...)` de score bij het opstarten. `localStorage` slaat alles op als tekst, dus met `parseInt` wordt het weer een getal.
- Beide staan in een `try { } catch { }`. In sommige browsers (bijvoorbeeld in privémodus) is `localStorage` geblokkeerd. Het spel crasht dan niet, maar de highscore wordt dan niet bewaard.

---

## Testen

Ik heb het spel automatisch getest in een browser (Playwright, Chromium):

| Test | Resultaat |
|------|-----------|
| Sprongsnelheid in de dino | −12 ✔ |
| Dubbele sprong: 2e druk in de lucht | `airJumps` = 1 ✔ |
| 3e druk in de lucht | wordt genegeerd ✔ |
| Plafond: laagste y-positie | 0 (niet meer boven het scherm) ✔ |
| Levens: 3 → 2 → 1 → game over | ✔ |
| Highscore na herladen pagina | nog steeds aanwezig ✔ |
| JavaScript-fouten | geen ✔ |

## Spelen

Open `index.html` in een browser. Druk op **spatie** of **pijltje omhoog** om te springen (twee keer voor een dubbele sprong) en op **pijltje omlaag** om te bukken.
