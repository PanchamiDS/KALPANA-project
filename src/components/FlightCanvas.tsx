import React, { useEffect, useRef } from 'react';
import { MissionScene } from '../types/mission';

interface FlightCanvasProps {
  scene: MissionScene;
  isPlaying: boolean;
  timeSec: number;
}

export const FlightCanvas: React.FC<FlightCanvasProps> = ({ scene, isPlaying, timeSec }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background based on altitude / theme
      const alt = scene.altitudeKm;
      const theme = scene.visualTheme;

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (alt < 15) {
        // Lower atmosphere / sunrise at Sriharikota
        bgGrad.addColorStop(0, '#0c1a2e');
        bgGrad.addColorStop(0.5, '#1e3a5f');
        bgGrad.addColorStop(0.85, '#e07a5f');
        bgGrad.addColorStop(1, '#f4a261');
      } else if (alt < 80) {
        // Stratosphere / Mesosphere transition
        bgGrad.addColorStop(0, '#02040a');
        bgGrad.addColorStop(0.6, '#081426');
        bgGrad.addColorStop(1, '#1a365d');
      } else {
        // Deep space / 500km SSO
        bgGrad.addColorStop(0, '#020307');
        bgGrad.addColorStop(0.7, '#050b14');
        bgGrad.addColorStop(1, '#0a1628');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw stars if above 20km or in space
      if (alt > 20 || theme === 'orbit' || theme === 'cubesat' || theme === 'separation') {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 70; i++) {
          const sx = (Math.sin(i * 99 + 1) * 0.5 + 0.5) * w;
          const sy = (Math.cos(i * 33 + 2) * 0.5 + 0.5) * (h * 0.65);
          const alpha = 0.3 + 0.5 * Math.sin(tick * 0.05 + i);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3 === 0 ? 1.5 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      // Draw Earth limb if above 50km
      if (alt > 50 || theme === 'orbit' || theme === 'cubesat' || theme === 'separation') {
        const earthY = h * 0.95;
        const earthRadius = w * 1.6;
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, earthY + earthRadius * 0.72, earthRadius, 0, Math.PI * 2);
        const earthGrad = ctx.createRadialGradient(
          w / 2, earthY + earthRadius * 0.72, earthRadius * 0.9,
          w / 2, earthY + earthRadius * 0.72, earthRadius
        );
        earthGrad.addColorStop(0, '#0d324d');
        earthGrad.addColorStop(0.7, '#1b4965');
        earthGrad.addColorStop(0.95, '#5fa8d3');
        earthGrad.addColorStop(1, '#bfe3f7');
        ctx.fillStyle = earthGrad;
        ctx.fill();

        // Atmosphere glow rim
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
        ctx.stroke();

        // Stylized continent curve (Indian subcontinent silhouette outline)
        ctx.fillStyle = 'rgba(74, 124, 89, 0.35)';
        ctx.beginPath();
        const cx = w * 0.52;
        const cy = earthY - 10;
        ctx.ellipse(cx, cy, w * 0.22, 28, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Specific Visual Renderers by Theme
      if (theme === 'launchpad' || (theme === 'ascent' && alt < 5)) {
        drawLaunchpadScene(ctx, w, h, tick, alt);
      } else if (theme === 'ascent' || theme === 'maxq') {
        drawAscentScene(ctx, w, h, tick, theme === 'maxq');
      } else if (theme === 'separation') {
        drawSeparationScene(ctx, w, h, tick);
      } else if (theme === 'descent') {
        drawDescentScene(ctx, w, h, tick);
      } else if (theme === 'landing') {
        drawLandingScene(ctx, w, h, tick);
      } else if (theme === 'orbit') {
        drawOrbitScene(ctx, w, h, tick);
      } else if (theme === 'cubesat') {
        drawCubeSatScene(ctx, w, h, tick);
      } else if (theme === 'ground') {
        drawGroundStationScene(ctx, w, h, tick);
      } else if (theme === 'economics') {
        drawEconomicsScene(ctx, w, h, tick);
      } else if (theme === 'team') {
        drawTeamIntroScene(ctx, w, h, tick);
      } else if (theme === 'intro') {
        drawCreedIntroScene(ctx, w, h, tick);
      } else {
        drawGenericSpaceScene(ctx, w, h, tick, scene.title);
      }

      // HUD Coordinate Reticle in corners
      drawHudFrame(ctx, w, h, tick, scene);

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scene, isPlaying, timeSec]);

  // SCENE DRAWERS
  function drawLaunchpadScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number, alt: number) {
    const padY = h * 0.82;

    // Ground & Sea at Sriharikota
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, padY + 15, w, h - padY);

    // Ocean horizon
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, padY - 10, w, 25);

    // Launch Pad Structure
    ctx.fillStyle = '#334155';
    ctx.fillRect(w * 0.35, padY - 8, w * 0.3, 20);

    // Gantry Tower (left side)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    const gantryX = w * 0.42;
    ctx.strokeRect(gantryX, padY - 210, 32, 210);

    // Gantry truss lines
    for (let y = padY - 190; y < padY; y += 30) {
      ctx.beginPath();
      ctx.moveTo(gantryX, y);
      ctx.lineTo(gantryX + 32, y + 25);
      ctx.stroke();
    }

    // Umbilical swing arm
    ctx.beginPath();
    ctx.moveTo(gantryX + 32, padY - 140);
    ctx.lineTo(w * 0.49, padY - 140);
    ctx.stroke();

    // Rocket body
    const rocketX = w * 0.5;
    const liftOffset = Math.min(alt * 25, 200);
    const rocketY = padY - 15 - liftOffset;

    drawRocketBody(ctx, rocketX, rocketY, 1.0, 0, alt > 0.1);

    // If engines firing
    if (alt > 0) {
      drawEngineFlame(ctx, rocketX, rocketY + 65, 1.2 + 0.2 * Math.sin(tick * 0.4), tick);
      // Launch pad smoke plume
      ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
      for (let s = 0; s < 12; s++) {
        const radius = 25 + s * 5;
        const sx = rocketX + (s - 6) * 15 + Math.sin(tick * 0.1 + s) * 10;
        ctx.beginPath();
        ctx.arc(sx, padY + 5, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawAscentScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number, isMaxQ: boolean) {
    const rx = w * 0.5;
    const ry = h * 0.45;
    const angle = -0.15; // slightly pitched east toward Bay of Bengal

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(angle);

    // Engine Exhaust Plume (9-engine cluster)
    drawEngineFlame(ctx, 0, 85, 2.2 + 0.3 * Math.sin(tick * 0.5), tick);

    // Rocket body
    drawRocketBody(ctx, 0, 0, 1.3, 0, true);

    // Max Q Shock Cone (Prandtl-Glauert vapor cone)
    if (isMaxQ) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, -20, 48, 14, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 15, 62, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Atmospheric shock ribbons
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(-10, -50);
      ctx.lineTo(-75, 40);
      ctx.lineTo(75, 40);
      ctx.lineTo(10, -50);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawSeparationScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    // Stage 1 falling back, Stage 2 igniting
    const sepProgress = (tick % 180) / 180;

    // Stage 2 (Upper Stage)
    ctx.save();
    ctx.translate(w * 0.55 + sepProgress * 40, h * 0.35 - sepProgress * 30);
    ctx.rotate(-0.25);
    // Stage 2 vacuum engine flame
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-7, 30);
    ctx.lineTo(0, 70 + Math.sin(tick * 0.6) * 8);
    ctx.lineTo(7, 30);
    ctx.fill();

    // Stage 2 body + fairing
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(-10, -50, 20, 75, [8, 8, 2, 2]);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-10, -10, 20, 6);
    ctx.restore();

    // Cold-gas RCS puffs
    ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
    ctx.beginPath();
    ctx.arc(w * 0.52, h * 0.42, 8 + (tick % 15), 0, Math.PI * 2);
    ctx.fill();

    // Stage 1 (Booster with grid fins)
    ctx.save();
    ctx.translate(w * 0.44 - sepProgress * 30, h * 0.55 + sepProgress * 40);
    ctx.rotate(0.35 * sepProgress);
    // Booster body
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-12, -45, 24, 85);
    // Interstage carbon ring
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-12, -45, 24, 10);
    // Grid fins deployed
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(-22, -35, 10, 6);
    ctx.strokeRect(12, -35, 10, 6);
    ctx.restore();
  }

  function drawDescentScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const bx = w * 0.5;
    const by = h * 0.42;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(0.05 * Math.sin(tick * 0.08));

    // Booster descending base-down
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-14, -70, 28, 110);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-14, -70, 28, 14);

    // 4 Titanium Grid fins actuated for steering
    const finWobble = Math.sin(tick * 0.15) * 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-26, -55 + finWobble, 12, 10);
    ctx.strokeRect(14, -55 - finWobble, 12, 10);

    // Cold Gas RCS steering jets firing on sides
    if (tick % 24 < 14) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(-14, -65);
      ctx.lineTo(-32, -68);
      ctx.lineTo(-14, -61);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLandingScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const seaY = h * 0.78;

    // Sea waves in Bay of Bengal
    ctx.fillStyle = '#0f2744';
    ctx.fillRect(0, seaY, w, h - seaY);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      const wy = seaY + 10 + i * 8;
      ctx.moveTo(0, wy);
      ctx.bezierCurveTo(w * 0.3, wy + Math.sin(tick * 0.05 + i) * 6, w * 0.7, wy - Math.sin(tick * 0.05 + i) * 6, w, wy);
      ctx.stroke();
    }

    // Drone Ship Barge
    const shipW = 160;
    const shipH = 22;
    const shipX = w * 0.5 - shipW / 2;
    const shipY = seaY - 10;

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(shipX, shipY, shipW, shipH, [4, 4, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Landing bullseye on deck
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, shipY + 4, 34, 7, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Descending Booster
    const landOffset = Math.max(0, 70 - (tick % 120) * 1.5);
    const boosterY = shipY - 80 - landOffset;

    // 3 Landing Engines Reignition Plume
    ctx.save();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(w * 0.48, boosterY + 70);
    ctx.lineTo(w * 0.5, shipY + 2);
    ctx.lineTo(w * 0.52, boosterY + 70);
    ctx.fill();

    // Landing legs deployed
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.5 - 12, boosterY + 60);
    ctx.lineTo(w * 0.5 - 28, shipY);
    ctx.moveTo(w * 0.5 + 12, boosterY + 60);
    ctx.lineTo(w * 0.5 + 28, shipY);
    ctx.stroke();

    // Booster core
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(w * 0.5 - 12, boosterY, 24, 70);
    // Soot marks from re-entry
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(w * 0.5 - 12, boosterY + 30, 24, 38);
    ctx.restore();
  }

  function drawOrbitScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const sx = w * 0.5;
    const sy = h * 0.4;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(0.08 * Math.sin(tick * 0.04));

    // Glowing vacuum thruster bell
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, 35, 12, 0, Math.PI * 2);
    ctx.fill();

    // Satellite Bus & Fairing
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(-16, -40, 32, 70, [12, 12, 4, 4]);
    ctx.fill();

    // Solar panels deployed
    const panelExt = 65 + Math.sin(tick * 0.05) * 5;
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-16 - panelExt, -15, panelExt, 28);
    ctx.fillRect(16, -15, panelExt, 28);

    // Solar cells grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-16 - panelExt, -15, panelExt, 28);
    ctx.strokeRect(16, -15, panelExt, 28);

    ctx.restore();
  }

  function drawCubeSatScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const originX = w * 0.35;
    const originY = h * 0.45;

    // Dispenser tube
    ctx.fillStyle = '#334155';
    ctx.fillRect(originX - 40, originY - 30, 80, 60);

    // 4 Ejected 3U CubeSats drifting
    for (let i = 0; i < 4; i++) {
      const dist = (i + 1) * 45 + (tick * 0.6) % 180;
      const angle = -0.3 + i * 0.22;
      const csX = originX + Math.cos(angle) * dist;
      const csY = originY + Math.sin(angle) * dist;

      ctx.save();
      ctx.translate(csX, csY);
      ctx.rotate(tick * 0.02 * (i % 2 === 0 ? 1 : -1));

      // 3U CubeSat chassis (gold/mylar insulation)
      ctx.fillStyle = i % 2 === 0 ? '#d97706' : '#0284c7';
      ctx.fillRect(-12, -7, 24, 14);

      // Micro solar wings
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-22, -4, 10, 8);
      ctx.fillRect(12, -4, 10, 8);

      // Blinking beacon LED
      if (Math.sin(tick * 0.2 + i * 2) > 0) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(8, -4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function drawGroundStationScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const dishX = w * 0.48;
    const dishY = h * 0.62;

    // Ground platform
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w * 0.2, dishY + 30, w * 0.6, 20);

    // Dish Pedestal
    ctx.fillStyle = '#64748b';
    ctx.fillRect(dishX - 6, dishY, 12, 30);

    // Parabolic Dish (tracking satellite)
    const trackAngle = -0.45 + Math.sin(tick * 0.03) * 0.2;
    ctx.save();
    ctx.translate(dishX, dishY);
    ctx.rotate(trackAngle);

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 36, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();

    // Feed horn
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -28);
    ctx.stroke();

    // RF Beam Waves transmitting to sky
    for (let r = 1; r <= 3; r++) {
      const waveRadius = 35 + ((tick * 2 + r * 25) % 90);
      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - waveRadius / 90)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -28, waveRadius, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawEconomicsScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const chartY = h * 0.72;
    const chartH = 140;

    // Background chart card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(w * 0.15, chartY - chartH - 20, w * 0.7, chartH + 40);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w * 0.15, chartY - chartH - 20, w * 0.7, chartH + 40);

    // Bar 1: Traditional Expendable ($$$)
    const bar1X = w * 0.32;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bar1X - 30, chartY - 110, 60, 110);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('100% COST', bar1X, chartY - 120);
    ctx.fillText('Expendable', bar1X, chartY + 16);

    // Bar 2: Reusable VYOM-1 (-60%)
    const bar2X = w * 0.68;
    const bar2Height = 44 + Math.sin(tick * 0.05) * 2;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(bar2X - 30, chartY - bar2Height, 60, bar2Height);
    ctx.fillText('40% COST (-60%)', bar2X, chartY - bar2Height - 10);
    ctx.fillText('VYOM-1 Reusable', bar2X, chartY + 16);
  }

  function drawGenericSpaceScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number, title: string) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 18px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, h * 0.5);
  }

  // REUSABLE ROCKET SPRITE
  function drawRocketBody(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, angle: number, withFins: boolean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // Fairing nosecone
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.quadraticCurveTo(-14, -40, -14, -20);
    ctx.lineTo(14, -20);
    ctx.quadraticCurveTo(14, -40, 0, -60);
    ctx.closePath();
    ctx.fill();

    // Stage 2 body
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-14, -20, 28, 32);

    // Carbon fiber interstage ring
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-14, 12, 28, 8);

    // Stage 1 booster body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-14, 20, 28, 60);

    // ASTRYX-K4 marking stripe
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-14, 35, 6, 30);
    ctx.fillRect(8, 35, 6, 30);

    // Titanium Grid Fins (if equipped)
    if (withFins) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-24, 24, 10, 6);
      ctx.strokeRect(14, 24, 10, 6);
    }

    // Engine nozzle skirts
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-12, 80);
    ctx.lineTo(-16, 88);
    ctx.lineTo(16, 88);
    ctx.lineTo(12, 80);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawEngineFlame(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, tick: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Outer flame plume
    const flicker = Math.sin(tick * 0.7) * 4;
    const flameGrad = ctx.createLinearGradient(0, 0, 0, 50);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.2, '#38bdf8');
    flameGrad.addColorStop(0.5, '#f97316');
    flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.quadraticCurveTo(-14, 25, 0, 55 + flicker);
    ctx.quadraticCurveTo(14, 25, 10, 0);
    ctx.closePath();
    ctx.fill();

    // Shock diamond core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(4, 20);
    ctx.lineTo(0, 30);
    ctx.lineTo(-4, 20);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawTeamIntroScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const cx = w / 2;
    const cy = h / 2;

    // Glowing cosmic nebula burst
    const nebulaGrad = ctx.createRadialGradient(cx, cy - 20, 30, cx, cy - 20, w * 0.45);
    nebulaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
    nebulaGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.2)');
    nebulaGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, w, h);

    // Rotating orbital rings
    ctx.save();
    ctx.translate(cx, cy - 40);
    ctx.rotate(tick * 0.008);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Top Mission Header Badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 150, 40, 300, 30, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION CREW PRESENTATION // ASTRYX-K4', cx, 60);

    // Main Team Title
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
    ctx.shadowBlur = 18;
    ctx.fillText('WE ARE TEAM ASTRYX-K4', cx, cy - 50);
    ctx.restore();

    // Subtitle Motto
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 15px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('“Dreaming beyond limits, building beyond boundaries!”', cx, cy - 20);

    // 4 Team Members Badges / Cards
    const members = [
      { name: 'Srishti', role: 'Team Lead', color: '#06b6d4' },
      { name: 'Vivek Matade', role: 'Propulsion', color: '#38bdf8' },
      { name: 'Sriharsha', role: 'Avionics & GNC', color: '#818cf8' },
      { name: 'Panchami', role: 'Payload & Ground', color: '#34d399' }
    ];

    const cardW = 160;
    const cardH = 68;
    const totalW = members.length * cardW + (members.length - 1) * 16;
    const startX = cx - totalW / 2;
    const cardY = cy + 25;

    members.forEach((m, idx) => {
      const bx = startX + idx * (cardW + 16);
      const isLead = idx === 0;

      // Card Box
      ctx.fillStyle = isLead ? 'rgba(8, 47, 73, 0.85)' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = isLead ? '#06b6d4' : '#334155';
      ctx.lineWidth = isLead ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(bx, cardY, cardW, cardH, [8]);
      ctx.fill();
      ctx.stroke();

      // Glowing dot
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(bx + 16, cardY + 22, 5, 0, Math.PI * 2);
      ctx.fill();

      // Member Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Chakra Petch", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(m.name, bx + 28, cardY + 26);

      // Role
      ctx.fillStyle = m.color;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(m.role, bx + 16, cardY + 48);
    });
  }

  function drawCreedIntroScene(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
    const cx = w / 2;
    const cy = h / 2;

    // Warp speed stars shooting outward
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const dist = ((tick * 4 + i * 15) % (w * 0.6));
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const len = 12 + dist * 0.08;

      ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(1, dist / 150)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(angle) * len, py + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.restore();

    // Central Emblem Reveal Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - 240, cy - 90, 480, 180, [12]);
    ctx.fill();
    ctx.stroke();

    // Mission Crest Callout
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ETHICAL AI ASSISTED RESEARCH & DESIGN', cx, cy - 55);

    // Dynamic Team Title
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Chakra Petch", sans-serif';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
    ctx.shadowBlur = 24;
    ctx.fillText('ASTRYX-K4 — LET’S REACH BEYOND!', cx, cy - 10);
    ctx.restore();

    // Subtitle AI Acknowledgement
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px "Chakra Petch", sans-serif';
    ctx.fillText('“We also acknowledge the use of AI tools in developing our work.”', cx, cy + 30);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('AUTONOMOUS GNC · GREEN HYBRIDS · LOW-COST ORBITAL LAUNCH', cx, cy + 58);
  }

  function drawHudFrame(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number, sc: MissionScene) {
    // Aerospace corner target crosshairs
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;

    // Top Left
    ctx.beginPath();
    ctx.moveTo(18, 32);
    ctx.lineTo(18, 18);
    ctx.lineTo(32, 18);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(w - 32, 18);
    ctx.lineTo(w - 18, 18);
    ctx.lineTo(w - 18, 32);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(18, h - 32);
    ctx.lineTo(18, h - 18);
    ctx.lineTo(32, h - 18);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(w - 32, h - 18);
    ctx.lineTo(w - 18, h - 18);
    ctx.lineTo(w - 18, h - 32);
    ctx.stroke();

    // Radar blip in top right corner
    const rx = w - 45;
    const ry = 45;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(rx, ry, 16, 0, Math.PI * 2);
    ctx.stroke();
    // Sweeping line
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    const sweepAngle = (tick * 0.05) % (Math.PI * 2);
    ctx.lineTo(rx + Math.cos(sweepAngle) * 16, ry + Math.sin(sweepAngle) * 16);
    ctx.stroke();
  }

  return (
    <canvas
      ref={canvasRef}
      width={960}
      height={540}
      className="w-full h-full object-cover rounded-lg block"
    />
  );
};
