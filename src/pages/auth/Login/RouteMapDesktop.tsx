import React from 'react';
import { Box } from '@mui/material';
import { SEG_PATHS, TICK_PATHS, JOBS_DATA } from './constants';
import { BrandLogo } from './BrandLogo';
import { useCurrentDay } from './useGreeting';
import * as styles from './styles';

import { useRouteAnimation } from './useRouteAnimation';

interface RouteMapDesktopProps {
  pathRef?: React.RefObject<SVGPathElement | null>;
  seg1GlowRef?: React.RefObject<SVGPathElement | null>;
  seg2GlowRef?: React.RefObject<SVGPathElement | null>;
  seg3GlowRef?: React.RefObject<SVGPathElement | null>;
  seg4GlowRef?: React.RefObject<SVGPathElement | null>;
  seg1CoreRef?: React.RefObject<SVGPathElement | null>;
  seg2CoreRef?: React.RefObject<SVGPathElement | null>;
  seg3CoreRef?: React.RefObject<SVGPathElement | null>;
  seg4CoreRef?: React.RefObject<SVGPathElement | null>;
  pin1Ref?: React.RefObject<SVGCircleElement | null>;
  pin2Ref?: React.RefObject<SVGCircleElement | null>;
  pin3Ref?: React.RefObject<SVGCircleElement | null>;
  pin4Ref?: React.RefObject<SVGCircleElement | null>;
  tick1Ref?: React.RefObject<SVGPathElement | null>;
  tick2Ref?: React.RefObject<SVGPathElement | null>;
  tick3Ref?: React.RefObject<SVGPathElement | null>;
  tick4Ref?: React.RefObject<SVGPathElement | null>;
  ring1Ref?: React.RefObject<SVGGElement | null>;
  ring2Ref?: React.RefObject<SVGGElement | null>;
  ring3Ref?: React.RefObject<SVGGElement | null>;
  ring4Ref?: React.RefObject<SVGGElement | null>;
  vanRef?: React.RefObject<SVGGElement | null>;
  routeGroupRef?: React.RefObject<SVGGElement | null>;
  pin1CircleStrokeRef?: React.RefObject<SVGCircleElement | null>;
  pin2CircleStrokeRef?: React.RefObject<SVGCircleElement | null>;
  pin3CircleStrokeRef?: React.RefObject<SVGCircleElement | null>;
  pin4CircleStrokeRef?: React.RefObject<SVGCircleElement | null>;
  jobCardsRef?: React.RefObject<(HTMLDivElement | null)[]>;
  jobMarksRef?: React.RefObject<(HTMLSpanElement | null)[]>;
  jobTimesRef?: React.RefObject<(HTMLSpanElement | null)[]>;
}

export const RouteMapDesktop: React.FC<RouteMapDesktopProps> = (props) => {
  const currentDay = useCurrentDay();
  const internalPathRef = React.useRef<SVGPathElement>(null);
  const internalSeg1GlowRef = React.useRef<SVGPathElement>(null);
  const internalSeg2GlowRef = React.useRef<SVGPathElement>(null);
  const internalSeg3GlowRef = React.useRef<SVGPathElement>(null);
  const internalSeg4GlowRef = React.useRef<SVGPathElement>(null);
  const internalSeg1CoreRef = React.useRef<SVGPathElement>(null);
  const internalSeg2CoreRef = React.useRef<SVGPathElement>(null);
  const internalSeg3CoreRef = React.useRef<SVGPathElement>(null);
  const internalSeg4CoreRef = React.useRef<SVGPathElement>(null);
  const internalPin1Ref = React.useRef<SVGCircleElement>(null);
  const internalPin2Ref = React.useRef<SVGCircleElement>(null);
  const internalPin3Ref = React.useRef<SVGCircleElement>(null);
  const internalPin4Ref = React.useRef<SVGCircleElement>(null);
  const internalTick1Ref = React.useRef<SVGPathElement>(null);
  const internalTick2Ref = React.useRef<SVGPathElement>(null);
  const internalTick3Ref = React.useRef<SVGPathElement>(null);
  const internalTick4Ref = React.useRef<SVGPathElement>(null);
  const internalRing1Ref = React.useRef<SVGGElement>(null);
  const internalRing2Ref = React.useRef<SVGGElement>(null);
  const internalRing3Ref = React.useRef<SVGGElement>(null);
  const internalRing4Ref = React.useRef<SVGGElement>(null);
  const internalVanRef = React.useRef<SVGGElement>(null);
  const internalRouteGroupRef = React.useRef<SVGGElement>(null);
  const internalPin1CircleStrokeRef = React.useRef<SVGCircleElement>(null);
  const internalPin2CircleStrokeRef = React.useRef<SVGCircleElement>(null);
  const internalPin3CircleStrokeRef = React.useRef<SVGCircleElement>(null);
  const internalPin4CircleStrokeRef = React.useRef<SVGCircleElement>(null);
  const internalJobCardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const internalJobMarksRef = React.useRef<(HTMLSpanElement | null)[]>([]);
  const internalJobTimesRef = React.useRef<(HTMLSpanElement | null)[]>([]);

  const pathRef = props.pathRef ?? internalPathRef;
  const seg1GlowRef = props.seg1GlowRef ?? internalSeg1GlowRef;
  const seg2GlowRef = props.seg2GlowRef ?? internalSeg2GlowRef;
  const seg3GlowRef = props.seg3GlowRef ?? internalSeg3GlowRef;
  const seg4GlowRef = props.seg4GlowRef ?? internalSeg4GlowRef;
  const seg1CoreRef = props.seg1CoreRef ?? internalSeg1CoreRef;
  const seg2CoreRef = props.seg2CoreRef ?? internalSeg2CoreRef;
  const seg3CoreRef = props.seg3CoreRef ?? internalSeg3CoreRef;
  const seg4CoreRef = props.seg4CoreRef ?? internalSeg4CoreRef;
  const pin1Ref = props.pin1Ref ?? internalPin1Ref;
  const pin2Ref = props.pin2Ref ?? internalPin2Ref;
  const pin3Ref = props.pin3Ref ?? internalPin3Ref;
  const pin4Ref = props.pin4Ref ?? internalPin4Ref;
  const tick1Ref = props.tick1Ref ?? internalTick1Ref;
  const tick2Ref = props.tick2Ref ?? internalTick2Ref;
  const tick3Ref = props.tick3Ref ?? internalTick3Ref;
  const tick4Ref = props.tick4Ref ?? internalTick4Ref;
  const ring1Ref = props.ring1Ref ?? internalRing1Ref;
  const ring2Ref = props.ring2Ref ?? internalRing2Ref;
  const ring3Ref = props.ring3Ref ?? internalRing3Ref;
  const ring4Ref = props.ring4Ref ?? internalRing4Ref;
  const vanRef = props.vanRef ?? internalVanRef;
  const routeGroupRef = props.routeGroupRef ?? internalRouteGroupRef;
  const pin1CircleStrokeRef = props.pin1CircleStrokeRef ?? internalPin1CircleStrokeRef;
  const pin2CircleStrokeRef = props.pin2CircleStrokeRef ?? internalPin2CircleStrokeRef;
  const pin3CircleStrokeRef = props.pin3CircleStrokeRef ?? internalPin3CircleStrokeRef;
  const pin4CircleStrokeRef = props.pin4CircleStrokeRef ?? internalPin4CircleStrokeRef;
  const jobCardsRef = props.jobCardsRef ?? internalJobCardsRef;
  const jobMarksRef = props.jobMarksRef ?? internalJobMarksRef;
  const jobTimesRef = props.jobTimesRef ?? internalJobTimesRef;

  useRouteAnimation({
    pathRef,
    seg1GlowRef,
    seg2GlowRef,
    seg3GlowRef,
    seg4GlowRef,
    seg1CoreRef,
    seg2CoreRef,
    seg3CoreRef,
    seg4CoreRef,
    pin1Ref,
    pin2Ref,
    pin3Ref,
    pin4Ref,
    tick1Ref,
    tick2Ref,
    tick3Ref,
    tick4Ref,
    ring1Ref,
    ring2Ref,
    ring3Ref,
    ring4Ref,
    vanRef,
    routeGroupRef,
    pin1CircleStrokeRef,
    pin2CircleStrokeRef,
    pin3CircleStrokeRef,
    pin4CircleStrokeRef,
    jobCardsRef,
    jobMarksRef,
    jobTimesRef,
  });

  return (
    <Box sx={styles.mapBox}>
      {/* 800x900 Autonomous Map SVG (exact viewBox and paths from RouteLine.dc.html) */}
      <Box
        component="svg"
        aria-hidden="true"
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
        sx={styles.mapSvg}
      >
        <rect x="0" y="0" width="800" height="900" fill="#F1F2EE" />
        <path d="M 30 600 L 205 595 L 212 668 L 200 760 L 40 765 Z" fill="#DCEAD3" />
        <path d="M 520 600 L 690 606 L 694 670 L 522 676 Z" fill="#DCEAD3" />
        <path
          d="M -20 381.1 L 0 384.4 L 20 387.4 L 40 389.9 L 60 391.8 L 80 393.2 L 100 393.9 L 120 393.9 L 140 393.3 L 160 392.1 L 180 390.2 L 200 387.8 L 220 384.9 L 240 381.7 L 260 378.1 L 280 374.3 L 300 370.5 L 320 366.7 L 340 363.1 L 360 359.8 L 380 356.8 L 400 354.3 L 420 352.3 L 440 350.9 L 460 350.1 L 480 350.0 L 500 350.6 L 520 351.8 L 540 353.6 L 560 356.0 L 580 358.9 L 600 362.1 L 620 365.7 L 640 369.4 L 660 373.2 L 680 377.0 L 700 380.6 L 720 384.0 L 740 387.0 L 760 389.6 L 780 391.6 L 800 393.0 L 820 393.8 L 820 437.8 L 800 437.0 L 780 435.6 L 760 433.6 L 740 431.0 L 720 428.0 L 700 424.6 L 680 421.0 L 660 417.2 L 640 413.4 L 620 409.7 L 600 406.1 L 580 402.9 L 560 400.0 L 540 397.6 L 520 395.8 L 500 394.6 L 480 394.0 L 460 394.1 L 440 394.9 L 420 396.3 L 400 398.3 L 380 400.8 L 360 403.8 L 340 407.1 L 320 410.7 L 300 414.5 L 280 418.3 L 260 422.1 L 240 425.7 L 220 428.9 L 200 431.8 L 180 434.2 L 160 436.1 L 140 437.3 L 120 437.9 L 100 437.9 L 80 437.2 L 60 435.8 L 40 433.9 L 20 431.4 L 0 428.4 L -20 425.1 Z"
          fill="#C9DCEA"
        />

        {/* Building rects (verbatim from RouteLine.dc.html) */}
        <g fill="#E4E5E0">
          <rect x="335" y="217" width="26" height="20" rx="2" />
          <rect x="433" y="514" width="26" height="12" rx="2" />
          <rect x="82" y="514" width="14" height="16" rx="2" />
          <rect x="622" y="419" width="22" height="16" rx="2" />
          <rect x="132" y="308" width="22" height="20" rx="2" />
          <rect x="55" y="84" width="18" height="20" rx="2" />
          <rect x="558" y="58" width="18" height="20" rx="2" />
          <rect x="395" y="196" width="18" height="12" rx="2" />
          <rect x="133" y="361" width="18" height="12" rx="2" />
          <rect x="10" y="748" width="14" height="16" rx="2" />
          <rect x="0" y="136" width="10" height="16" rx="2" />
          <rect x="655" y="666" width="14" height="12" rx="2" />
          <rect x="414" y="320" width="10" height="10" rx="2" />
          <rect x="641" y="874" width="22" height="20" rx="2" />
          <rect x="321" y="852" width="14" height="12" rx="2" />
          <rect x="794" y="25" width="26" height="20" rx="2" />
          <rect x="526" y="315" width="26" height="12" rx="2" />
          <rect x="17" y="719" width="10" height="12" rx="2" />
          <rect x="419" y="17" width="22" height="12" rx="2" />
          <rect x="627" y="95" width="26" height="10" rx="2" />
          <rect x="554" y="407" width="26" height="20" rx="2" />
          <rect x="58" y="217" width="10" height="12" rx="2" />
          <rect x="536" y="706" width="14" height="16" rx="2" />
          <rect x="285" y="83" width="18" height="10" rx="2" />
          <rect x="340" y="65" width="10" height="10" rx="2" />
          <rect x="641" y="75" width="14" height="10" rx="2" />
          <rect x="425" y="185" width="22" height="12" rx="2" />
          <rect x="411" y="221" width="22" height="10" rx="2" />
          <rect x="291" y="296" width="26" height="16" rx="2" />
          <rect x="196" y="869" width="18" height="12" rx="2" />
          <rect x="285" y="1" width="22" height="10" rx="2" />
          <rect x="661" y="526" width="14" height="10" rx="2" />
          <rect x="527" y="59" width="22" height="16" rx="2" />
          <rect x="10" y="55" width="18" height="10" rx="2" />
          <rect x="3" y="443" width="22" height="20" rx="2" />
          <rect x="570" y="811" width="18" height="16" rx="2" />
          <rect x="400" y="731" width="26" height="12" rx="2" />
          <rect x="207" y="513" width="10" height="20" rx="2" />
          <rect x="0" y="352" width="26" height="20" rx="2" />
          <rect x="186" y="828" width="18" height="12" rx="2" />
          <rect x="310" y="201" width="26" height="10" rx="2" />
          <rect x="206" y="601" width="18" height="12" rx="2" />
          <rect x="394" y="626" width="22" height="16" rx="2" />
          <rect x="164" y="873" width="18" height="12" rx="2" />
          <rect x="185" y="199" width="18" height="10" rx="2" />
          <rect x="388" y="819" width="10" height="12" rx="2" />
          <rect x="738" y="49" width="10" height="12" rx="2" />
          <rect x="332" y="639" width="14" height="20" rx="2" />
          <rect x="148" y="842" width="22" height="10" rx="2" />
          <rect x="433" y="402" width="18" height="16" rx="2" />
          <rect x="156" y="57" width="26" height="16" rx="2" />
          <rect x="210" y="645" width="18" height="16" rx="2" />
          <rect x="19" y="210" width="22" height="20" rx="2" />
          <rect x="7" y="838" width="18" height="12" rx="2" />
          <rect x="289" y="704" width="10" height="12" rx="2" />
          <rect x="520" y="434" width="26" height="16" rx="2" />
          <rect x="212" y="76" width="10" height="20" rx="2" />
          <rect x="520" y="90" width="22" height="10" rx="2" />
          <rect x="744" y="335" width="14" height="20" rx="2" />
          <rect x="30" y="306" width="10" height="12" rx="2" />
          <rect x="438" y="57" width="10" height="20" rx="2" />
          <rect x="740" y="98" width="22" height="12" rx="2" />
          <rect x="146" y="196" width="22" height="12" rx="2" />
          <rect x="33" y="506" width="10" height="16" rx="2" />
          <rect x="311" y="331" width="26" height="20" rx="2" />
          <rect x="143" y="3" width="22" height="20" rx="2" />
          <rect x="52" y="316" width="18" height="12" rx="2" />
          <rect x="298" y="179" width="22" height="12" rx="2" />
          <rect x="18" y="2" width="18" height="16" rx="2" />
          <rect x="85" y="321" width="14" height="20" rx="2" />
          <rect x="749" y="219" width="14" height="20" rx="2" />
          <rect x="651" y="157" width="18" height="10" rx="2" />
          <rect x="452" y="154" width="10" height="10" rx="2" />
          <rect x="759" y="820" width="10" height="16" rx="2" />
          <rect x="579" y="877" width="18" height="16" rx="2" />
          <rect x="319" y="712" width="14" height="16" rx="2" />
          <rect x="194" y="360" width="14" height="16" rx="2" />
          <rect x="415" y="91" width="26" height="20" rx="2" />
          <rect x="433" y="646" width="26" height="10" rx="2" />
          <rect x="550" y="885" width="14" height="20" rx="2" />
          <rect x="2" y="650" width="18" height="16" rx="2" />
          <rect x="662" y="815" width="14" height="16" rx="2" />
          <rect x="212" y="211" width="14" height="20" rx="2" />
          <rect x="394" y="53" width="22" height="12" rx="2" />
          <rect x="560" y="222" width="14" height="10" rx="2" />
          <rect x="409" y="436" width="14" height="10" rx="2" />
          <rect x="627" y="36" width="26" height="20" rx="2" />
          <rect x="631" y="819" width="26" height="20" rx="2" />
          <rect x="342" y="8" width="10" height="10" rx="2" />
          <rect x="301" y="616" width="26" height="12" rx="2" />
          <rect x="741" y="528" width="10" height="20" rx="2" />
          <rect x="203" y="34" width="14" height="12" rx="2" />
          <rect x="303" y="25" width="10" height="16" rx="2" />
          <rect x="135" y="215" width="14" height="10" rx="2" />
          <rect x="285" y="839" width="26" height="10" rx="2" />
          <rect x="82" y="225" width="10" height="10" rx="2" />
          <rect x="555" y="537" width="26" height="10" rx="2" />
          <rect x="414" y="862" width="18" height="12" rx="2" />
          <rect x="10" y="317" width="14" height="16" rx="2" />
          <rect x="445" y="442" width="18" height="12" rx="2" />
          <rect x="667" y="319" width="10" height="12" rx="2" />
          <rect x="519" y="6" width="22" height="20" rx="2" />
          <rect x="349" y="339" width="14" height="10" rx="2" />
          <rect x="290" y="330" width="10" height="16" rx="2" />
          <rect x="283" y="894" width="10" height="20" rx="2" />
          <rect x="659" y="552" width="10" height="10" rx="2" />
          <rect x="283" y="152" width="18" height="10" rx="2" />
          <rect x="128" y="528" width="14" height="16" rx="2" />
          <rect x="634" y="219" width="14" height="12" rx="2" />
          <rect x="436" y="709" width="26" height="20" rx="2" />
          <rect x="526" y="511" width="18" height="10" rx="2" />
          <rect x="312" y="77" width="14" height="12" rx="2" />
          <rect x="749" y="159" width="18" height="16" rx="2" />
          <rect x="800" y="360" width="10" height="12" rx="2" />
          <rect x="570" y="36" width="10" height="12" rx="2" />
          <rect x="545" y="33" width="18" height="12" rx="2" />
          <rect x="622" y="311" width="10" height="20" rx="2" />
          <rect x="744" y="622" width="22" height="10" rx="2" />
          <rect x="392" y="170" width="26" height="16" rx="2" />
          <rect x="200" y="53" width="18" height="16" rx="2" />
          <rect x="329" y="181" width="18" height="12" rx="2" />
          <rect x="564" y="5" width="22" height="12" rx="2" />
          <rect x="749" y="316" width="18" height="12" rx="2"></rect>
          <rect x="443" y="204" width="26" height="10" rx="2" />
          <rect x="190" y="335" width="10" height="12" rx="2" />
          <rect x="727" y="79" width="14" height="10" rx="2" />
          <rect x="283" y="625" width="10" height="20" rx="2" />
          <rect x="91" y="19" width="10" height="10" rx="2" />
          <rect x="674" y="871" width="22" height="20" rx="2" />
          <rect x="634" y="714" width="14" height="12" rx="2" />
          <rect x="451" y="889" width="10" height="20" rx="2" />
          <rect x="75" y="141" width="14" height="10" rx="2" />
          <rect x="526" y="541" width="18" height="12" rx="2" />
          <rect x="55" y="39" width="26" height="10" rx="2" />
          <rect x="326" y="501" width="18" height="16" rx="2" />
          <rect x="8" y="619" width="22" height="16" rx="2" />
          <rect x="736" y="646" width="22" height="16" rx="2" />
          <rect x="332" y="426" width="10" height="20" rx="2" />
          <rect x="81" y="79" width="14" height="20" rx="2" />
          <rect x="293" y="721" width="14" height="20" rx="2" />
          <rect x="399" y="606" width="18" height="12" rx="2" />
          <rect x="428" y="143" width="14" height="10" rx="2" />
          <rect x="673" y="898" width="22" height="20" rx="2" />
          <rect x="643" y="443" width="22" height="12" rx="2" />
          <rect x="207" y="624" width="18" height="10" rx="2" />
          <rect x="634" y="4" width="22" height="10" rx="2" />
          <rect x="536" y="811" width="14" height="12" rx="2" />
          <rect x="288" y="512" width="10" height="16" rx="2" />
          <rect x="210" y="138" width="10" height="20" rx="2" />
          <rect x="1" y="694" width="14" height="16" rx="2" />
          <rect x="518" y="196" width="10" height="16" rx="2" />
          <rect x="85" y="188" width="18" height="16" rx="2" />
          <rect x="222" y="9" width="14" height="10" rx="2" />
          <rect x="52" y="13" width="14" height="16" rx="2" />
          <rect x="291" y="650" width="14" height="16" rx="2" />
          <rect x="417" y="459" width="18" height="12" rx="2" />
          <rect x="174" y="32" width="22" height="12" rx="2" />
          <rect x="752" y="362" width="14" height="10" rx="2" />
          <rect x="288" y="436" width="10" height="20" rx="2" />
          <rect x="71" y="874" width="26" height="20" rx="2" />
          <rect x="19" y="74" width="10" height="12" rx="2" />
          <rect x="73" y="849" width="22" height="20" rx="2" />
          <rect x="732" y="442" width="26" height="16" rx="2" />
          <rect x="431" y="303" width="10" height="16" rx="2" />
          <rect x="289" y="58" width="10" height="16" rx="2" />
          <rect x="147" y="819" width="26" height="10" rx="2" />
          <rect x="404" y="811" width="14" height="20" rx="2" />
          <rect x="441" y="830" width="10" height="12" rx="2" />
          <rect x="324" y="151" width="14" height="20" rx="2" />
          <rect x="547" y="834" width="14" height="10" rx="2" />
          <rect x="287" y="810" width="18" height="12" rx="2" />
          <rect x="128" y="453" width="26" height="10" rx="2" />
          <rect x="741" y="5" width="18" height="12" rx="2" />
          <rect x="410" y="843" width="14" height="12" rx="2" />
          <rect x="558" y="520" width="10" height="10" rx="2" />
          <rect x="90" y="290" width="10" height="12" rx="2" />
          <rect x="570" y="317" width="10" height="12" rx="2" />
          <rect x="413" y="884" width="14" height="10" rx="2" />
          <rect x="415" y="501" width="10" height="10" rx="2" />
          <rect x="442" y="544" width="10" height="12" rx="2" />
          <rect x="38" y="451" width="26" height="10" rx="2" />
          <rect x="551" y="158" width="10" height="12" rx="2" />
          <rect x="564" y="852" width="10" height="12" rx="2" />
          <rect x="529" y="732" width="10" height="16" rx="2" />
          <rect x="426" y="38" width="10" height="12" rx="2" />
          <rect x="210" y="308" width="18" height="16" rx="2" />
          <rect x="556" y="444" width="22" height="12" rx="2" />
          <rect x="335" y="31" width="22" height="20" rx="2" />
          <rect x="132" y="335" width="10" height="10" rx="2" />
          <rect x="286" y="867" width="26" height="12" rx="2" />
          <rect x="394" y="294" width="18" height="12" rx="2" />
          <rect x="523" y="142" width="14" height="16" rx="2" />
          <rect x="42" y="65" width="14" height="10" rx="2" />
          <rect x="660" y="726" width="26" height="12" rx="2" />
          <rect x="49" y="295" width="10" height="12" rx="2" />
          <rect x="34" y="367" width="14" height="10" rx="2" />
          <rect x="301" y="461" width="14" height="10" rx="2" />
          <rect x="11" y="862" width="22" height="10" rx="2" />
          <rect x="209" y="817" width="10" height="12" rx="2" />
          <rect x="442" y="854" width="26" height="10" rx="2" />
          <rect x="552" y="100" width="22" height="10" rx="2" />
          <rect x="164" y="138" width="10" height="12" rx="2" />
          <rect x="136" y="289" width="14" height="12" rx="2" />
          <rect x="74" y="824" width="10" height="10" rx="2" />
          <rect x="672" y="508" width="14" height="10" rx="2" />
          <rect x="309" y="891" width="26" height="12" rx="2" />
          <rect x="223" y="190" width="10" height="12" rx="2" />
          <rect x="152" y="82" width="26" height="16" rx="2" />
          <rect x="746" y="900" width="18" height="20" rx="2" />
          <rect x="335" y="601" width="10" height="10" rx="2" />
          <rect x="571" y="717" width="10" height="12" rx="2" />
          <rect x="187" y="513" width="14" height="20" rx="2" />
          <rect x="394" y="4" width="18" height="12" rx="2" />
          <rect x="180" y="12" width="22" height="10" rx="2" />
          <rect x="218" y="330" width="14" height="12" rx="2" />
          <rect x="529" y="854" width="26" height="12" rx="2" />
          <rect x="3" y="33" width="26" height="10" rx="2" />
          <rect x="419" y="704" width="10" height="16" rx="2" />
          <rect x="124" y="881" width="26" height="10" rx="2" />
          <rect x="308" y="514" width="10" height="16" rx="2" />
          <rect x="741" y="715" width="14" height="16" rx="2" />
          <rect x="282" y="213" width="22" height="12" rx="2" />
          <rect x="395" y="325" width="10" height="10" rx="2" />
          <rect x="326" y="535" width="22" height="10" rx="2" />
          <rect x="738" y="29" width="22" height="10" rx="2" />
          <rect x="797" y="159" width="10" height="10" rx="2" />
          <rect x="654" y="205" width="14" height="10" rx="2" />
          <rect x="406" y="408" width="18" height="20" rx="2" />
          <rect x="32" y="138" width="10" height="16" rx="2" />
          <rect x="636" y="847" width="18" height="16" rx="2" />
          <rect x="732" y="208" width="10" height="12" rx="2" />
          <rect x="446" y="23" width="22" height="16" rx="2" />
          <rect x="454" y="460" width="10" height="12" rx="2" />
          <rect x="187" y="447" width="10" height="16" rx="2" />
          <rect x="63" y="193" width="10" height="16" rx="2" />
          <rect x="572" y="203" width="14" height="12" rx="2" />
          <rect x="618" y="78" width="14" height="10" rx="2" />
          <rect x="637" y="539" width="14" height="16" rx="2" />
          <rect x="569" y="464" width="18" height="10" rx="2" />
          <rect x="407" y="537" width="14" height="10" rx="2" />
          <rect x="323" y="288" width="10" height="12" rx="2" />
          <rect x="672" y="843" width="14" height="12" rx="2" />
          <rect x="619" y="235" width="10" height="10" rx="2" />
          <rect x="458" y="538" width="10" height="10" rx="2" />
          <rect x="307" y="537" width="14" height="16" rx="2" />
          <rect x="538" y="334" width="18" height="10" rx="2" />
          <rect x="664" y="27" width="14" height="10" rx="2" />
          <rect x="7" y="519" width="14" height="12" rx="2" />
          <rect x="191" y="887" width="14" height="12" rx="2" />
          <rect x="204" y="721" width="18" height="20" rx="2" />
          <rect x="519" y="223" width="10" height="10" rx="2" />
          <rect x="761" y="735" width="10" height="20" rx="2" />
          <rect x="399" y="71" width="22" height="10" rx="2" />
          <rect x="33" y="327" width="10" height="12" rx="2" />
          <rect x="319" y="812" width="18" height="16" rx="2" />
          <rect x="85" y="55" width="14" height="12" rx="2" />
          <rect x="341" y="94" width="22" height="20" rx="2" />
          <rect x="343" y="841" width="10" height="20" rx="2" />
          <rect x="342" y="300" width="22" height="20" rx="2" />
          <rect x="636" y="339" width="18" height="12" rx="2" />
          <rect x="190" y="288" width="10" height="10" rx="2" />
          <rect x="151" y="900" width="18" height="20" rx="2" />
          <rect x="732" y="162" width="10" height="10" rx="2" />
          <rect x="660" y="344" width="10" height="16" rx="2" />
          <rect x="132" y="498" width="14" height="20" rx="2" />
          <rect x="749" y="871" width="10" height="20" rx="2" />
          <rect x="201" y="848" width="18" height="12" rx="2" />
          <rect x="324" y="869" width="14" height="10" rx="2" />
          <rect x="667" y="63" width="10" height="10" rx="2" />
          <rect x="460" y="742" width="14" height="10" rx="2" />
          <rect x="227" y="43" width="10" height="10" rx="2" />
          <rect x="312" y="51" width="14" height="10" rx="2" />
          <rect x="800" y="95" width="18" height="16" rx="2" />
          <rect x="316" y="4" width="18" height="12" rx="2" />
          <rect x="207" y="444" width="22" height="10" rx="2" />
          <rect x="66" y="348" width="18" height="10" rx="2" />
          <rect x="734" y="295" width="10" height="12" rx="2" />
          <rect x="661" y="42" width="10" height="12" rx="2" />
          <rect x="743" y="849" width="14" height="16" rx="2" />
          <rect x="347" y="739" width="10" height="12" rx="2" />
          <rect x="85" y="372" width="18" height="12" rx="2" />
          <rect x="135" y="140" width="14" height="16" rx="2" />
          <rect x="759" y="550" width="10" height="10" rx="2" />
          <rect x="551" y="85" width="14" height="10" rx="2" />
          <rect x="398" y="655" width="10" height="10" rx="2" />
          <rect x="20" y="596" width="14" height="10" rx="2" />
          <rect x="535" y="208" width="10" height="16" rx="2" />
          <rect x="615" y="200" width="18" height="12" rx="2" />
          <rect x="616" y="148" width="22" height="20" rx="2" />
          <rect x="449" y="311" width="22" height="10" rx="2" />
          <rect x="458" y="612" width="14" height="12" rx="2" />
          <rect x="557" y="741" width="26" height="10" rx="2" />
          <rect x="11" y="189" width="18" height="16" rx="2" />
          <rect x="640" y="314" width="10" height="20" rx="2" />
          <rect x="160" y="219" width="18" height="12" rx="2" />
          <rect x="349" y="149" width="14" height="16" rx="2" />
          <rect x="2" y="289" width="14" height="10" rx="2" />
          <rect x="414" y="666" width="10" height="12" rx="2" />
          <rect x="308" y="430" width="14" height="10" rx="2" />
          <rect x="391" y="513" width="14" height="10" rx="2" />
          <rect x="188" y="539" width="10" height="10" rx="2" />
          <rect x="73" y="0" width="18" height="10" rx="2" />
          <rect x="396" y="89" width="14" height="10" rx="2" />
          <rect x="187" y="150" width="10" height="10" rx="2" />
          <rect x="661" y="466" width="18" height="10" rx="2" />
          <rect x="18" y="895" width="14" height="16" rx="2" />
          <rect x="446" y="871" width="26" height="12" rx="2" />
          <rect x="799" y="465" width="14" height="16" rx="2" />
          <rect x="128" y="896" width="18" height="16" rx="2" />
          <rect x="339" y="709" width="10" height="10" rx="2" />
          <rect x="654" y="745" width="10" height="16" rx="2" />
          <rect x="441" y="805" width="22" height="20" rx="2" />
          <rect x="347" y="900" width="10" height="16" rx="2" />
          <rect x="629" y="19" width="18" height="10" rx="2" />
          <rect x="431" y="1" width="10" height="10" rx="2" />
          <rect x="739" y="468" width="10" height="10" rx="2" />
          <rect x="390" y="883" width="14" height="20" rx="2" />
          <rect x="316" y="739" width="22" height="16" rx="2" />
          <rect x="622" y="736" width="22" height="20" rx="2" />
          <rect x="539" y="408" width="10" height="20" rx="2" />
          <rect x="797" y="317" width="22" height="20" rx="2" />
          <rect x="401" y="147" width="14" height="12" rx="2" />
          <rect x="19" y="92" width="18" height="12" rx="2" />
          <rect x="302" y="102" width="10" height="10" rx="2" />
          <rect x="459" y="830" width="14" height="12" rx="2" />
          <rect x="795" y="232" width="18" height="12" rx="2" />
          <rect x="530" y="879" width="14" height="20" rx="2" />
          <rect x="144" y="31" width="22" height="16" rx="2" />
          <rect x="7" y="496" width="10" height="10" rx="2" />
          <rect x="630" y="461" width="14" height="16" rx="2" />
          <rect x="397" y="37" width="22" height="10" rx="2" />
          <rect x="330" y="464" width="10" height="10" rx="2" />
          <rect x="580" y="857" width="10" height="10" rx="2" />
          <rect x="793" y="63" width="26" height="10" rx="2" />
          <rect x="459" y="407" width="14" height="12" rx="2" />
          <rect x="662" y="228" width="14" height="16" rx="2" />
          <rect x="546" y="463" width="10" height="12" rx="2" />
          <rect x="662" y="100" width="10" height="12" rx="2" />
          <rect x="131" y="837" width="10" height="16" rx="2" />
          <rect x="756" y="521" width="10" height="20" rx="2" />
          <rect x="387" y="713" width="26" height="10" rx="2" />
          <rect x="452" y="100" width="14" height="16" rx="2" />
          <rect x="133" y="53" width="18" height="10" rx="2" />
          <rect x="424" y="167" width="10" height="10" rx="2" />
          <rect x="31" y="749" width="10" height="10" rx="2" />
          <rect x="571" y="334" width="10" height="20" rx="2" />
          <rect x="554" y="296" width="10" height="12" rx="2" />
          <rect x="447" y="220" width="10" height="10" rx="2" />
          <rect x="576" y="508" width="18" height="16" rx="2" />
          <rect x="76" y="536" width="10" height="10" rx="2" />
          <rect x="184" y="221" width="22" height="16" rx="2" />
          <rect x="392" y="851" width="10" height="12" rx="2" />
          <rect x="75" y="453" width="22" height="10" rx="2" />
          <rect x="520" y="291" width="10" height="12" rx="2" />
          <rect x="278" y="536" width="10" height="12" rx="2" />
          <rect x="351" y="463" width="10" height="10" rx="2" />
          <rect x="89" y="496" width="10" height="12" rx="2" />
          <rect x="680" y="751" width="10" height="16" rx="2" />
          <rect x="566" y="150" width="18" height="10" rx="2" />
          <rect x="422" y="899" width="18" height="10" rx="2" />
          <rect x="55" y="135" width="10" height="12" rx="2" />
          <rect x="284" y="29" width="10" height="12" rx="2" />
          <rect x="34" y="189" width="14" height="12" rx="2" />
          <rect x="350" y="415" width="10" height="10" rx="2" />
        </g>

        {/* Roads (verbatim from RouteLine.dc.html) */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M -20 120 L 820 135 M -20 170 L 250 175 M 500 180 L 820 190 M -20 480 L 820 495 M -20 680 L 820 700 M 120 -20 L 110 920 M 380 -20 L 372 920 M 600 -20 L 612 920 M 780 -20 L 790 920 M 60 500 L 52 920 M 170 260 L 165 560"
            stroke="#DEDFD9"
            strokeWidth="11"
          />
          <path
            d="M -20 260 L 820 270 M -20 570 L 820 590 M 260 -20 L 250 920 M 490 -20 L 500 920 M 700 -20 L 720 920"
            stroke="#D6D7D0"
            strokeWidth="22"
          />
          <path
            d="M -20 802 L 0 800 L 20 798 L 40 797 L 60 795 L 80 794 L 100 792 L 120 791 L 140 790 L 160 788 L 180 787 L 200 786 L 220 785 L 240 784 L 260 783 L 280 782 L 300 782 L 320 781 L 340 781 L 360 780 L 380 780 L 400 780 L 420 780 L 440 780 L 460 780 L 480 781 L 500 781 L 520 782 L 540 783 L 560 783 L 580 784 L 600 785 L 620 786 L 640 787 L 660 789 L 680 790 L 700 791 L 720 793 L 740 794 L 760 796 L 780 797 L 800 799 L 820 800"
            stroke="#E8D28A"
            strokeWidth="24"
          />
          <path
            d="M -20 120 L 820 135 M -20 170 L 250 175 M 500 180 L 820 190 M -20 480 L 820 495 M -20 680 L 820 700 M 120 -20 L 110 920 M 380 -20 L 372 920 M 600 -20 L 612 920 M 780 -20 L 790 920 M 60 500 L 52 920 M 170 260 L 165 560"
            stroke="#FFFFFF"
            strokeWidth="8"
          />
          <path
            d="M -20 260 L 820 270 M -20 570 L 820 590 M 260 -20 L 250 920 M 490 -20 L 500 920 M 700 -20 L 720 920"
            stroke="#FFFFFF"
            strokeWidth="18"
          />
          <path
            d="M -20 802 L 0 800 L 20 798 L 40 797 L 60 795 L 80 794 L 100 792 L 120 791 L 140 790 L 160 788 L 180 787 L 200 786 L 220 785 L 240 784 L 260 783 L 280 782 L 300 782 L 320 781 L 340 781 L 360 780 L 380 780 L 400 780 L 420 780 L 440 780 L 460 780 L 480 781 L 500 781 L 520 782 L 540 783 L 560 783 L 580 784 L 600 785 L 620 786 L 640 787 L 660 789 L 680 790 L 700 791 L 720 793 L 740 794 L 760 796 L 780 797 L 800 799 L 820 800"
            stroke="#FBEBB5"
            strokeWidth="20"
          />
        </g>

        {/* Street labels (verbatim from RouteLine.dc.html) */}
        <g>
          <text
            x="380"
            y="266.5"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(0.7 380 266.5)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            KING STREET
          </text>
          <text
            x="640"
            y="586"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(1.4 640 586)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            MILL ROAD
          </text>
          <text
            x="330"
            y="790"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(-3.0 330 790)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            HARBOUR WAY
          </text>
          <text
            x="254"
            y="120"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(90.6 254 120)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            STATION RD
          </text>
          <text
            x="496"
            y="700"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(89.4 496 700)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            CHURCH ST
          </text>
          <text
            x="712"
            y="520"
            textAnchor="middle"
            dominantBaseline="middle"
            transform="rotate(88.8 712 520)"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="0.8"
            fill="#80867E"
            stroke="#F1F2EE"
            strokeWidth="3"
            paintOrder="stroke"
          >
            PARK AVE
          </text>
          <text
            x="118"
            y="684"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="13"
            fontWeight="600"
            fill="#5F8452"
            stroke="#DCEAD3"
            strokeWidth="3"
            paintOrder="stroke"
          >
            Victoria Park
          </text>
          <text
            x="640"
            y="396"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            fontSize="13"
            fontStyle="italic"
            fontWeight="600"
            fill="#5E86A6"
          >
            River Wey
          </text>
        </g>

        {/* Base dashed route (marching-ants animation) */}
        <path
          className="rl-ants"
          ref={pathRef}
          d={SEG_PATHS.base}
          fill="none"
          stroke="#B9C2AD"
          strokeWidth="5"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />

        {/* 4 route segments (glow + core) */}
        <g ref={routeGroupRef} fill="none" strokeLinecap="round">
          <path
            ref={seg1GlowRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg1}
            stroke="#A3F000"
            strokeWidth="18"
            strokeOpacity="0.55"
          />
          <path
            ref={seg2GlowRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg2}
            stroke="#A3F000"
            strokeWidth="18"
            strokeOpacity="0.55"
          />
          <path
            ref={seg3GlowRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg3}
            stroke="#A3F000"
            strokeWidth="18"
            strokeOpacity="0.55"
          />
          <path
            ref={seg4GlowRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg4}
            stroke="#A3F000"
            strokeWidth="18"
            strokeOpacity="0.55"
          />
          <path
            ref={seg1CoreRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg1}
            stroke="#2F6B00"
            strokeWidth="6"
          />
          <path
            ref={seg2CoreRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg2}
            stroke="#2F6B00"
            strokeWidth="6"
          />
          <path
            ref={seg3CoreRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg3}
            stroke="#2F6B00"
            strokeWidth="6"
          />
          <path
            ref={seg4CoreRef}
            className="rl-route"
            pathLength="1"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            d={SEG_PATHS.seg4}
            stroke="#2F6B00"
            strokeWidth="6"
          />
        </g>

        {/* Pulsing rings */}
        <g fill="none" stroke="#A3F000" strokeWidth="4">
          <g ref={ring1Ref} className="rl-burst" opacity="0">
            <circle className="rl-ring" cx="250" cy="580" r="13" />
          </g>
          <g ref={ring2Ref} className="rl-burst" opacity="0">
            <circle className="rl-ring" cx="495" cy="500" r="13" />
          </g>
          <g ref={ring3Ref} className="rl-burst" opacity="0">
            <circle className="rl-ring" cx="560" cy="280" r="13" />
          </g>
          <g ref={ring4Ref} className="rl-burst" opacity="0">
            <circle className="rl-ring" cx="700" cy="170" r="13" />
          </g>
        </g>

        {/* Route stop pins */}
        <g strokeWidth="5">
          <circle cx="120" cy="780" r="14" fill="#0B0E0B" stroke="#A3F000" />
          <circle
            ref={pin1Ref}
            className="rl-pin"
            cx="250"
            cy="580"
            r="15"
            fill="#FFFFFF"
            stroke="#B9C2AD"
          />
          <circle
            ref={pin2Ref}
            className="rl-pin"
            cx="495"
            cy="500"
            r="15"
            fill="#FFFFFF"
            stroke="#B9C2AD"
          />
          <circle
            ref={pin3Ref}
            className="rl-pin"
            cx="560"
            cy="280"
            r="15"
            fill="#FFFFFF"
            stroke="#B9C2AD"
          />
          <circle
            ref={pin4Ref}
            className="rl-pin"
            cx="700"
            cy="170"
            r="15"
            fill="#FFFFFF"
            stroke="#B9C2AD"
          />
        </g>

        {/* Checkmark ticks */}
        <g fill="none" stroke="#A3F000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path ref={tick1Ref} className="rl-tick" opacity="0" d={TICK_PATHS.tick1} />
          <path ref={tick2Ref} className="rl-tick" opacity="0" d={TICK_PATHS.tick2} />
          <path ref={tick3Ref} className="rl-tick" opacity="0" d={TICK_PATHS.tick3} />
          <path ref={tick4Ref} className="rl-tick" opacity="0" d={TICK_PATHS.tick4} />
        </g>

        {/* Job stop icons (verbatim coordinates & SVG paths) */}
        {/* Stop 1: Boiler / Flame */}
        <g transform="translate(250 530)">
          <path d="M0 18 V32" stroke="#0B0E0B" strokeWidth="2" strokeOpacity="0.35" />
          <circle ref={pin1CircleStrokeRef} r="19" fill="#FFFFFF" stroke="#B9C2AD" strokeWidth="3" />
          <path
            transform="translate(-10 -10) scale(0.833)"
            d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8Z"
            fill="#FFB547"
            stroke="#0B0E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Stop 2: Electrical / Lightning */}
        <g transform="translate(495 450)">
          <path d="M0 18 V32" stroke="#0B0E0B" strokeWidth="2" strokeOpacity="0.35" />
          <circle ref={pin2CircleStrokeRef} r="19" fill="#FFFFFF" stroke="#B9C2AD" strokeWidth="3" />
          <path
            transform="translate(-10 -10) scale(0.833)"
            d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
            fill="#FFE14D"
            stroke="#0B0E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Stop 3: Plumbing / Water drop */}
        <g transform="translate(560 230)">
          <path d="M0 18 V32" stroke="#0B0E0B" strokeWidth="2" strokeOpacity="0.35" />
          <circle ref={pin3CircleStrokeRef} r="19" fill="#FFFFFF" stroke="#B9C2AD" strokeWidth="3" />
          <path
            transform="translate(-10 -10) scale(0.833)"
            d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"
            fill="#7CC4F2"
            stroke="#0B0E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Stop 4: Quote / Clipboard */}
        <g transform="translate(700 120)">
          <path d="M0 18 V32" stroke="#0B0E0B" strokeWidth="2" strokeOpacity="0.35" />
          <circle ref={pin4CircleStrokeRef} r="19" fill="#FFFFFF" stroke="#B9C2AD" strokeWidth="3" />
          <path
            transform="translate(-10 -10) scale(0.833)"
            d="M7 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M9 3h6v4H9zM8 12h8M8 16h5"
            fill="#FFFFFF"
            stroke="#0B0E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Vehicle (arrow with glow aura) */}
        <g ref={vanRef} className="rl-vehicle" transform="translate(120 780) rotate(-60)" opacity="1">
          <circle r="28" fill="#A3F000" fillOpacity="0.28" />
          <circle r="16" fill="#0B0E0B" stroke="#FFFFFF" strokeWidth="3.5" />
          <path d="M -6 -7.5 L 9 0 L -6 7.5 L -2.5 0 Z" fill="#A3F000" stroke="#A3F000" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      </Box>

      {/* Top Header Overlay */}
      <Box sx={styles.mapLogoWrap}>
        <BrandLogo variant="desktop" />
        <Box sx={styles.mapBadge}>
          <Box component="span" aria-hidden="true" className="rl-badge-dot" sx={styles.mapBadgeDot} />
          {currentDay}
        </Box>
      </Box>

      {/* Bottom Floating Jobs List */}
      <Box component="ul" sx={styles.jobListContainer}>
        {JOBS_DATA.map((job, idx) => (
          <Box component="li" key={job.title} className="rl-job" sx={styles.jobItem}>
            <Box
              ref={(el) => {
                if (jobCardsRef?.current) jobCardsRef.current[idx] = el as HTMLDivElement | null;
              }}
              className="rl-jobcard"
              sx={styles.jobCardBase}
            >
              <Box
                component="span"
                ref={(el) => {
                  if (jobMarksRef?.current) jobMarksRef.current[idx] = el as HTMLSpanElement | null;
                }}
                className="rl-mark"
                sx={styles.jobMarkBase}
              >
                {String(idx + 1)}
              </Box>
              <Box sx={styles.jobTextStack}>
                <Box component="span" sx={styles.jobTitle}>
                  {job.title}
                </Box>
                <Box
                  component="span"
                  ref={(el) => {
                    if (jobTimesRef?.current) jobTimesRef.current[idx] = el as HTMLSpanElement | null;
                  }}
                  sx={styles.jobTime}
                >
                  {job.time}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
