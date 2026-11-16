<template>
  <!--
    Bride – single-line sketch, side profile facing RIGHT (towards the groom).
    Shares the 360×460 scene viewBox with SplashGroom so both layers line up.
    Every stroke uses pathLength="1" so the splash can "draw" it.
  -->
  <svg
    viewBox="0 0 360 460"
    class="figure h-full w-full overflow-visible"
    fill="#FFFDFB"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Veil (behind her back, flowing from the bun) -->
    <g class="veil">
      <path pathLength="1" class="veil-fill" d="M146 84C128 104 116 146 98 200C114 210 134 212 152 204C150 170 147 130 150 98Z" />
      <g fill="none">
        <path pathLength="1" d="M141 108C131 140 122 172 112 204" />
        <path pathLength="1" d="M146 122C142 152 138 180 132 208" />
      </g>
    </g>

    <!-- Gown skirt – full A-line with a soft train -->
    <g class="skirt">
      <path
        pathLength="1"
        d="M152 204C140 262 110 340 54 408C42 422 30 434 34 439C80 444 160 444 218 440C214 398 200 320 179 204Z"
      />
      <g fill="none">
        <path pathLength="1" d="M159 218C149 290 128 362 100 440" />
        <path pathLength="1" d="M166 220C163 300 152 380 146 442" />
        <path pathLength="1" d="M172 218C176 292 182 366 188 441" />
        <path pathLength="1" d="M60 424C70 430 80 428 88 434" />
      </g>
    </g>

    <!-- Neck & shoulders -->
    <path pathLength="1" d="M161 104L160 124L176 124L177 104Z" />
    <path pathLength="1" d="M160 121C154 123 149 128 148 136L149 146L184 146C183 136 181 128 176 121Z" />

    <!-- Bodice (strapless, fitted) -->
    <path
      pathLength="1"
      d="M148 140C147 160 150 185 152 206L179 206C177 190 180 170 188 154C186 148 184 144 182 140C170 145 158 145 148 140Z"
    />
    <g fill="none">
      <path pathLength="1" d="M162 148L164 204" />
      <path pathLength="1" d="M172 148L171 204" />
      <path pathLength="1" d="M151 198C160 201 170 201 179 198" />
    </g>

    <!-- Head: face profile, updo, flowers -->
    <path
      pathLength="1"
      d="M142 80C136 84 136 94 144 97C150 99 155 93 153 86C151 80 147 78 142 80Z"
    />
    <path
      pathLength="1"
      d="M178 74C181 80 182 86 182 88L187 95C185 97 183 97 183 98C185 100 184 102 183 103C184 106 182 109 178 110C172 113 166 112 162 109C156 106 152 100 151 92C150 80 158 70 168 69C173 69 176 71 178 74Z"
    />
    <g fill="none">
      <path pathLength="1" d="M178 74C171 76 165 81 162 90C160 97 158 103 156 106" />
      <path pathLength="1" d="M170 70C162 72 156 78 153 86" />
      <path pathLength="1" d="M164 92C160 90 158 97 163 99" />
      <path pathLength="1" d="M179 84.5C177.5 83.5 175.5 83.5 174 84.5" />
      <path pathLength="1" d="M178 80L173.5 79.5" />
      <path pathLength="1" d="M182 103.5L179 103.5" />
    </g>
    <circle pathLength="1" cx="146" cy="76" r="3" />
    <circle pathLength="1" cx="139.5" cy="83" r="2.5" />
    <circle pathLength="1" cx="152" cy="79" r="2.2" />
    <circle pathLength="1" cx="162.5" cy="103" r="1.2" />

    <!-- Near arm (pivots at the shoulder 171,130) – reaches for the groom's hands -->
    <g transform="translate(171 130)">
      <g class="arm arm--bride">
        <g transform="translate(-171 -130)">
          <path
            pathLength="1"
            d="M166 128C163 150 163 172 167 190C175 198 184 204 192 208L195 200C187 196 181 190 177 185C176 166 177 148 176 131C173 126 168 126 166 128Z"
          />
          <path pathLength="1" d="M192 208C197 210 203 208 205 204C203 200 198 199 195 200Z" />
        </g>
      </g>
    </g>
  </svg>
</template>
