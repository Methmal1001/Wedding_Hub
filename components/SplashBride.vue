<template>
  <!--
    Bride – side profile, painted in a watercolour style (realistic colour
    washes + hand-painted edge/grain filter). Drawn facing right, then
    mirrored so she faces the groom (left).
  -->
  <svg
    viewBox="0 0 260 460"
    class="figure h-full w-full overflow-visible"
    role="img"
    aria-label="Bride in a white ball gown and veil, painted in watercolour, shown in side profile"
    fill="none"
    stroke="#5E4A4C"
    stroke-width="1.05"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <defs>
      <filter id="wc-bride" x="-15%" y="-10%" width="130%" height="120%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="wobble" />
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="5" result="grain" />
        <feColorMatrix in="grain" type="saturate" values="0" result="grainGrey" />
        <feComponentTransfer in="grainGrey" result="paper">
          <feFuncR type="linear" slope="0.22" intercept="0.86" />
          <feFuncG type="linear" slope="0.22" intercept="0.86" />
          <feFuncB type="linear" slope="0.22" intercept="0.86" />
        </feComponentTransfer>
        <feBlend in="wobble" in2="paper" mode="multiply" result="textured" />
        <feComposite in="textured" in2="wobble" operator="in" result="wash" />
        <feMorphology in="wobble" operator="erode" radius="1.1" result="inner" />
        <feComposite in="wobble" in2="inner" operator="out" result="rim" />
        <feColorMatrix in="rim" type="matrix" values="0.78 0 0 0 0  0 0.74 0 0 0  0 0 0.76 0 0  0 0 0 0.4 0" result="pooled" />
        <feMerge>
          <feMergeNode in="wash" />
          <feMergeNode in="pooled" />
        </feMerge>
      </filter>
    </defs>

    <g transform="translate(260 0) scale(-1 1)" filter="url(#wc-bride)">
      <!-- Veil (behind) -->
      <g class="veil">
        <path
          pathLength="1"
          fill="rgba(255,255,255,0.6)"
          stroke="#CDBFC0"
          stroke-width="0.9"
          d="M134 52 C112 96 98 180 92 260 C86 330 70 400 28 450 L104 450 C110 400 118 330 124 260 C130 190 138 120 146 64 Z"
        />
        <path pathLength="1" d="M136 70 C122 140 112 240 100 330 C94 380 84 420 66 446" stroke="#D9CDCD" stroke-width="0.7" />
        <path pathLength="1" d="M140 74 C130 150 124 250 116 350" stroke="#D9CDCD" stroke-width="0.7" />
      </g>

      <!-- Bouquet, held low behind her -->
      <g>
        <path pathLength="1" d="M132 246 C126 262 122 276 117 292" stroke="#7E9A6C" stroke-width="1.1" />
        <path pathLength="1" d="M140 250 C140 266 136 280 131 294" stroke="#7E9A6C" stroke-width="1.1" />
        <path pathLength="1" fill="#9DB58A" stroke="#7E9A6C" stroke-width="0.8" d="M124 252 C116 254 112 262 113 268 C120 266 124 260 124 252 Z" />
        <path pathLength="1" fill="#9DB58A" stroke="#7E9A6C" stroke-width="0.8" d="M146 248 C150 256 150 264 146 270 C142 264 142 256 146 248 Z" />
        <path pathLength="1" fill="#B5C9A2" stroke="#7E9A6C" stroke-width="0.8" d="M114 236 C106 234 100 240 100 246 C108 246 112 242 114 236 Z" />
        <circle pathLength="1" cx="132" cy="236" r="8.5" fill="#F2C4CB" stroke="#D99AA6" />
        <path pathLength="1" d="M132 232 C136 232 137 238 133 239 C129 240 128 235 131 234" stroke="#C98593" stroke-width="0.9" />
        <circle pathLength="1" cx="121" cy="241" r="6.5" fill="#FFFFFF" stroke="#D9CDCD" />
        <path pathLength="1" d="M121 238.5 C124 239 124 243 121 243.5 C118.5 243.5 118.5 240 120.5 240" stroke="#CDBFC0" stroke-width="0.8" />
        <circle pathLength="1" cx="141" cy="243" r="6.5" fill="#E8A9B4" stroke="#C98593" />
        <path pathLength="1" d="M141 240.5 C144 241 144 245 141 245.5 C138.5 245.5 138.5 242 140.5 242" stroke="#B9707F" stroke-width="0.8" />
        <circle pathLength="1" cx="126" cy="228" r="5" fill="#F7E1E3" stroke="#D99AA6" />
        <path pathLength="1" d="M128 248 C126 258 128 266 124 276" stroke="#E3CB97" stroke-width="1.4" />
      </g>

      <!-- Skirt (ball gown with train) -->
      <g class="skirt">
        <path
          pathLength="1"
          fill="#FFFFFF"
          stroke="#CFC2C2"
          d="M152 214 C130 262 98 340 44 436 C32 444 20 447 6 450 L120 452 C170 452 210 450 240 446
             C224 340 200 262 184 214 Z"
        />
        <!-- Soft shadow washes in the folds -->
        <path pathLength="1" fill="#E9DDDB" stroke="none" opacity="0.75" d="M152 216 C130 262 98 340 44 436 C60 438 80 440 92 446 C116 380 140 300 160 222 Z" />
        <path pathLength="1" fill="#EFE5E3" stroke="none" opacity="0.7" d="M177 222 C190 300 202 380 212 448 L230 446 C216 360 200 280 184 218 Z" />
        <path pathLength="1" d="M168 222 C166 300 160 380 150 448" stroke="#DCCFCE" stroke-width="0.9" />
        <path pathLength="1" d="M177 222 C190 300 202 380 212 448" stroke="#DCCFCE" stroke-width="0.9" />
        <path pathLength="1" d="M160 222 C142 300 116 380 92 446" stroke="#DCCFCE" stroke-width="0.9" />
        <path pathLength="1" d="M20 444 C90 448 170 448 236 440" stroke="#E3CB97" stroke-width="1" stroke-dasharray="0.012 0.01" class="lace" />
      </g>

      <!-- Bodice -->
      <path
        pathLength="1"
        fill="#FFFFFF"
        stroke="#CFC2C2"
        d="M147 140 C145 160 150 190 152 214 L184 214 C184 198 186 182 192 170 C198 160 196 150 188 142
           C176 146 160 146 147 140 Z"
      />
      <path pathLength="1" fill="#EDE3E1" stroke="none" opacity="0.8" d="M147 142 C145 160 150 190 152 212 L160 212 C158 190 154 165 154 144 Z" />
      <path pathLength="1" d="M168 148 C170 168 170 190 168 210" stroke="#E2D6D5" stroke-width="0.7" />
      <!-- Satin sash -->
      <path pathLength="1" fill="#E3CB97" stroke="#C9A86A" stroke-width="0.8" d="M151 207 C164 211 174 211 185 207 L185 217 C174 221 164 221 151 217 Z" />

      <!-- Head, neck & shoulders -->
      <path
        pathLength="1"
        fill="#F1CDB1"
        stroke="#8C6A5E"
        d="M147 141 C145 132 148 124 151 118 C152 108 151 98 150 88 C142 78 140 62 146 50
           C156 38 180 40 188 56 C190 62 190 66 190 70 C191 73 194 77 196 80
           C197 82 196 84 193 84 C194 86 195 87 194 88 C193 89 194 90.5 193.5 91.5
           C192 93 191 94.5 191.5 96 C190 99 184 100 178 99 C177 106 178 114 181 121
           C183 130 185 136 188 142 C176 146 160 146 147 141 Z"
      />
      <path pathLength="1" fill="#E2B497" stroke="none" opacity="0.55" d="M160 86 C166 94 172 98 178 100 C177 108 178 116 181 122 L151 120 C152 108 151 98 150 88 Z" />
      <ellipse pathLength="1" cx="183" cy="83" rx="4.5" ry="2.8" fill="#EE9C9C" stroke="none" opacity="0.4" />
      <path pathLength="1" d="M178 99 C170 97 164 92 161 86" stroke="#8C6A5E" stroke-width="0.8" />
      <path pathLength="1" d="M167 127 C172 129 177 129 181 126" stroke="#B88E7C" stroke-width="0.7" />
      <!-- Ear & earring -->
      <path pathLength="1" fill="#EBC1A4" stroke="#8C6A5E" d="M162 72 C157 71 156 78 159 82 C161 84 163 83 163 81" stroke-width="0.9" />
      <path pathLength="1" d="M160 84 L160 88" stroke="#C9A86A" stroke-width="0.9" />
      <circle pathLength="1" cx="160" cy="90.5" r="2.3" fill="#FFF6E6" stroke="#C9A86A" stroke-width="0.9" />
      <!-- Eye with lashes, brow, lips -->
      <path pathLength="1" fill="#FFFFFF" d="M180.5 75 C183.4 72.4 186.8 72.5 189 74.6 C186.6 76.4 183.4 76.6 180.5 75 Z" stroke="#4B3022" stroke-width="0.9" />
      <circle pathLength="1" cx="186.4" cy="74.6" r="1.25" fill="#3B2A20" stroke="none" />
      <path pathLength="1" d="M182.5 73.2 L181.6 71.4 M185 72.6 L184.8 70.6 M187.4 73 L188.2 71.2 M189 74.6 L190.6 73.6" stroke="#2E1F18" stroke-width="0.8" />
      <path pathLength="1" d="M178 67 C182 65 186 65 189 67" stroke="#4B3022" stroke-width="1.2" />
      <path pathLength="1" fill="#C96A78" stroke="#A9545F" stroke-width="0.6" d="M193.8 86.8 C195 87.3 195.2 88.3 194.2 88.9 C195 89.6 194.8 90.8 193.4 91.2 C192 90.6 191 89.8 190 89.2 C191 88.4 192.4 87.4 193.8 86.8 Z" />
      <path pathLength="1" d="M192.5 81.5 C193.8 82.4 194.2 83.2 193.6 84" stroke="#B88E7C" stroke-width="0.7" />

      <!-- Hair (soft updo) & bun -->
      <path
        pathLength="1"
        fill="#4B3022"
        stroke="#3A2419"
        d="M189 60 C186 46 174 40 160 40 C148 40 140 50 141 62 C142 72 146 80 150 88
           C152 82 156 76 160 72 C164 66 170 62 176 60 C182 59 186 59 189 60 Z"
      />
      <path pathLength="1" fill="#4B3022" stroke="#3A2419" d="M148 44 C138 36 124 42 126 56 C128 68 142 70 148 62 Z" />
      <path pathLength="1" d="M140 46 C132 48 132 60 140 60 C144 60 144 54 140 53" stroke="#A3836A" stroke-width="1" />
      <path pathLength="1" d="M184 52 C176 46 164 46 152 54" stroke="#A3836A" stroke-width="1" />
      <path pathLength="1" d="M176 44 C166 42 154 46 147 56" stroke="#A3836A" stroke-width="1" />
      <path pathLength="1" d="M182 56 C172 54 162 60 156 70" stroke="#A3836A" stroke-width="0.8" />
      <path pathLength="1" d="M167 66 C164 74 164 82 167 90 C168 93 166 95 164 96" stroke="#4B3022" stroke-width="1.1" />
      <!-- Tiara -->
      <path pathLength="1" d="M166 43 C172 41 179 43 184 48" stroke="#C9A86A" stroke-width="1.2" />
      <circle pathLength="1" cx="170" cy="41.5" r="1.4" fill="#FFF6E6" stroke="#C9A86A" stroke-width="0.8" />
      <circle pathLength="1" cx="176.5" cy="42.5" r="1.6" fill="#FFF6E6" stroke="#C9A86A" stroke-width="0.8" />
      <circle pathLength="1" cx="182" cy="45.5" r="1.3" fill="#FFF6E6" stroke="#C9A86A" stroke-width="0.8" />

      <!-- Near arm (reaches out to hold the groom's hand) -->
      <g transform="translate(162 132)">
        <g class="arm">
          <g transform="translate(-162 -132)">
            <path
              pathLength="1"
              fill="#F1CDB1"
              stroke="#8C6A5E"
              d="M170 132 C177 154 181 176 181 194 C191 204 202 213 214 219 C222 219 230 223 234 229
                 C235 234 229 236 222 236 C217 236 213 234 210 231 C196 224 180 212 166 200
                 C162 182 158 160 154 140 C156 132 164 128 170 132 Z"
            />
            <path pathLength="1" d="M222 226 L230 230" stroke="#B88E7C" stroke-width="0.8" />
            <path pathLength="1" d="M219 230.5 L228 233.5" stroke="#B88E7C" stroke-width="0.8" />
            <path pathLength="1" d="M213 218.5 L209.5 230.5" stroke="#C9A86A" stroke-width="1.2" />
            <path pathLength="1" d="M177 198 C179 196 180 194 181 192" stroke="#B88E7C" stroke-width="0.8" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>
