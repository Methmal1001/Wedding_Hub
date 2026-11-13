<template>
  <!--
    Groom – side profile facing right, painted in a watercolour style:
    realistic colour washes + an SVG filter that adds hand-painted edge
    wobble, pigment granulation and darker pooled edges.
    Limbs are wrapped in translate → animated group → inverse-translate so
    CSS rotations pivot exactly at the hip / shoulder joints.
  -->
  <svg
    viewBox="0 0 260 460"
    class="figure h-full w-full overflow-visible"
    role="img"
    aria-label="Groom in a black tuxedo, painted in watercolour, shown in side profile"
    fill="none"
    stroke="#3E3036"
    stroke-width="1.15"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <defs>
      <filter id="wc-groom" x="-15%" y="-10%" width="130%" height="120%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="wobble" />
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="3" result="grain" />
        <feColorMatrix in="grain" type="saturate" values="0" result="grainGrey" />
        <feComponentTransfer in="grainGrey" result="paper">
          <feFuncR type="linear" slope="0.32" intercept="0.78" />
          <feFuncG type="linear" slope="0.32" intercept="0.78" />
          <feFuncB type="linear" slope="0.32" intercept="0.78" />
        </feComponentTransfer>
        <feBlend in="wobble" in2="paper" mode="multiply" result="textured" />
        <feComposite in="textured" in2="wobble" operator="in" result="wash" />
        <feMorphology in="wobble" operator="erode" radius="1.1" result="inner" />
        <feComposite in="wobble" in2="inner" operator="out" result="rim" />
        <feColorMatrix in="rim" type="matrix" values="0.7 0 0 0 0  0 0.7 0 0 0  0 0 0.7 0 0  0 0 0 0.45 0" result="pooled" />
        <feMerge>
          <feMergeNode in="wash" />
          <feMergeNode in="pooled" />
        </feMerge>
      </filter>
    </defs>

    <g filter="url(#wc-groom)">
      <!-- Far leg -->
      <g transform="translate(150 280)">
        <g class="leg leg--far">
          <g transform="translate(-150 -280)">
            <path pathLength="1" fill="#26242B" d="M142 280 C141 330 142 384 141 436 L156 436 C156 390 158 340 160 288 Z" />
            <path pathLength="1" fill="#17161A" d="M140 436 L156 436 C168 437 176 442 176 447 L176 450 L138 450 Z" />
          </g>
        </g>
      </g>

      <!-- Near leg -->
      <g transform="translate(172 272)">
        <g class="leg leg--near">
          <g transform="translate(-172 -272)">
            <path pathLength="1" fill="#33313A" d="M160 284 C162 330 164 384 164 436 L184 436 C184 380 186 320 184 262 Z" />
            <path pathLength="1" d="M174 292 C175 340 175 390 174 432" stroke="#6B6774" stroke-width="0.8" />
            <path pathLength="1" fill="#17161A" d="M162 436 L184 436 C196 437 204 442 204 447 L204 450 L160 450 Z" />
            <path pathLength="1" d="M170 440 C180 439 192 441 199 445" stroke="#8B8794" stroke-width="0.9" />
          </g>
        </g>
      </g>

      <!-- Head (scaled to realistic ~7.5-head proportions, anchored at the collar) -->
      <g transform="matrix(0.9 0 0 0.9 17.6 9.8)">
        <path
          pathLength="1"
          fill="#EDC2A2"
          d="M146 98 C144 88 141 78 139 68 C135 56 136 40 148 28 C160 18 182 20 190 34
             C192 40 192 46 194 52 C196 57 199 61 200 64 C199 66 196 67 194 67
             C195 69 196 70 195 71.5 C194 72.5 195 74 194.5 75 C193.5 77 192 79 193 81
             C191 85 184 86 178 85 C176 90 176 95 180 100 Z"
        />
        <!-- Soft shading under the jaw and a touch of colour on the cheek -->
        <path pathLength="1" fill="#D9A383" stroke="none" opacity="0.55" d="M160 70 C166 80 174 86 180 88 C178 94 178 98 181 101 L146 98 C144 88 142 80 141 72 Z" />
        <ellipse pathLength="1" cx="183" cy="64" rx="5" ry="3" fill="#E79C8C" stroke="none" opacity="0.35" />
        <!-- Jaw, ear, eye, brow, mouth -->
        <path pathLength="1" d="M178 85 C170 83 163 78 159 70" stroke-width="0.9" />
        <path pathLength="1" fill="#E3B191" d="M160 52 C154 50 152 58 155 63 C157 66 160 65 161 61" stroke-width="1" />
        <path pathLength="1" fill="#FFFFFF" d="M181 52 C184 49.4 187.6 49.6 190 51.8 C187.4 53.6 184 53.8 181 52 Z" stroke-width="0.9" />
        <circle pathLength="1" cx="187.2" cy="51.7" r="1.3" fill="#3B2A20" stroke="none" />
        <path pathLength="1" d="M181.5 49.3 C184.5 47.6 188 48 190.5 50.2" stroke-width="0.8" />
        <path pathLength="1" d="M180 45.5 C184 43.5 188 44 191 45.5" stroke="#4A3022" stroke-width="1.6" />
        <path pathLength="1" fill="#C98F7E" stroke-width="0.6" d="M194 69.6 C195.4 70.2 195.8 71 195 71.6 L192 71.9 Z" />
        <path pathLength="1" d="M189.5 72 L194.5 71.8" stroke-width="0.9" />
        <path pathLength="1" d="M193 64.5 C194.5 65.5 195 66.3 194.5 67" stroke-width="0.8" />
        <path pathLength="1" d="M177.5 92 C179.5 93.5 179.5 95.5 178 97" stroke-width="0.8" />

        <!-- Hair (short, neatly combed back) -->
        <path
          pathLength="1"
          fill="#5A3D2B"
          d="M192 38 C190 26 178 18 162 18 C146 18 136 28 134 44 C133 54 135 62 139 68
             C142 64 144 58 150 54 C154 50 158 48 160 48 C166 44 170 40 176 38 C182 37 188 38 192 38 Z"
        />
        <path pathLength="1" d="M188 31 C178 25 162 25 150 33" stroke="#9C7A5E" stroke-width="1" />
        <path pathLength="1" d="M182 23 C168 21 152 25 142 37" stroke="#9C7A5E" stroke-width="1" />
        <path pathLength="1" d="M174 32 C162 34 151 42 144 55" stroke="#9C7A5E" stroke-width="0.9" />
        <path pathLength="1" d="M186 36 C176 33 166 36 156 44" stroke="#9C7A5E" stroke-width="0.8" />
        <path pathLength="1" d="M160 48 L161 57" stroke="#4A3022" stroke-width="1.2" />
      </g>

      <!-- Jacket (tuxedo) -->
      <path
        pathLength="1"
        fill="#2A282F"
        d="M146 96 C138 104 132 118 132 134 C132 170 135 200 137 226 C138 250 136 270 133 290
           C148 284 166 274 184 264 C186 248 186 232 187 220 C188 200 192 175 193 150
           C194 130 190 112 180 100 C170 98 156 96 146 96 Z"
      />
      <!-- Sheen along the back -->
      <path pathLength="1" fill="#4A4752" stroke="none" opacity="0.6" d="M146 106 C140 130 140 170 144 220 C142 180 142 140 150 110 Z" />
      <!-- Shirt front & wing collar -->
      <path pathLength="1" fill="#FFFFFF" d="M180 100 C186 108 190 120 192 140 C186 136 182 124 181 101 Z" />
      <!-- Bow tie -->
      <path pathLength="1" fill="#121115" d="M182 100 L191 96.5 L193 104 L185 105.5 Z" />
      <!-- Satin lapel, button, pocket, vent -->
      <path pathLength="1" fill="#1B1A1F" stroke="#55515C" stroke-width="0.8" d="M181 101 C176 120 175 142 183 164 C186 150 186 126 181 101 Z" />
      <path pathLength="1" d="M176 118 L183 115" stroke="#6B6774" />
      <circle pathLength="1" cx="188.5" cy="196" r="1.8" fill="#55515C" stroke="none" />
      <path pathLength="1" d="M150 236 L177 234" stroke="#6B6774" stroke-width="1" />
      <path pathLength="1" d="M136 242 C138 260 137 276 134 288" stroke="#6B6774" stroke-width="0.9" />
      <!-- Boutonnière -->
      <circle pathLength="1" cx="184.5" cy="129" r="4.6" fill="#F2C4CB" />
      <circle pathLength="1" cx="184.5" cy="129" r="2" fill="#E3A0AE" stroke="none" />
      <path pathLength="1" d="M182 133 C179 139 177 142 173 145" stroke="#7E9A6C" stroke-width="1.1" />
      <path pathLength="1" d="M178 139 C175 138 173 139 172 141 C175 142 177 141 178 139 Z" fill="#8FAE7E" stroke-width="0.8" />

      <!-- Near arm (reaches out to hold the bride's hand) -->
      <g transform="translate(156 112)">
        <g class="arm">
          <g transform="translate(-156 -112)">
            <path
              pathLength="1"
              fill="#302E36"
              d="M168 106 C182 128 190 160 193 182 C208 196 222 210 237 221 L229 240
                 C206 230 186 212 168 194 C160 170 152 146 145 120 C150 108 160 102 168 106 Z"
            />
            <path pathLength="1" d="M182 197 C186 193 189 189 191 185" stroke="#6B6774" stroke-width="0.9" />
            <!-- shirt cuff -->
            <path pathLength="1" fill="#FFFFFF" d="M237 221 L241.5 223 L233.5 242 L229 240 Z" />
            <!-- hand -->
            <path
              pathLength="1"
              fill="#EDC2A2"
              d="M241.5 223 C249 222 256 226 260 232 C262 236 259 240 253 241 C246 243 239 244 233.5 242 Z"
            />
            <path pathLength="1" d="M244 223 C247 219 251 218 254 220" stroke-width="0.9" />
            <path pathLength="1" d="M251 230 L258.5 234" stroke-width="0.8" />
            <path pathLength="1" d="M247 236 L256.5 238" stroke-width="0.8" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>
