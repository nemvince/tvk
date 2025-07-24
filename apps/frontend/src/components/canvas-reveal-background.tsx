import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import {
  CustomBlending,
  GLSL3,
  type Mesh,
  OneFactor,
  SrcAlphaFactor,
  ShaderMaterial as ThreeShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { cn } from '@/lib/utils';

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ('x' | 'y')[];
}

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}

const DotMatrix: FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = '',
  center = ['x', 'y'],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: 'uniform3fv',
      },
      u_opacities: {
        value: opacities,
        type: 'uniform1fv',
      },
      u_total_size: {
        value: totalSize,
        type: 'uniform1f',
      },
      u_dot_size: {
        value: dotSize,
        type: 'uniform1f',
      },
      u_reverse: {
        value: shader.includes('u_reverse_active') ? 1 : 0,
        type: 'uniform1i',
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      maxFps={60}
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes('x')
                ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }
            ${
              center.includes('y')
                ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            // Animation Timing Logic
            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            // Calculate timing offset for Intro (from center)
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            // Calculate timing offset for Outro (from edges)
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  hovered?: boolean;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const timestamp = clock.getElapsedTime();

    const material = ref.current.material as ThreeShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = useMemo(() => {
    const preparedUniforms: Record<string, { value: unknown; type?: string }> =
      {};

    for (const [uniformName, uniform] of Object.entries(uniforms)) {
      switch (uniform.type) {
        case 'uniform1f':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1f',
          };
          break;
        case 'uniform1i':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1i',
          };
          break;
        case 'uniform3f':
          preparedUniforms[uniformName] = {
            value: new Vector3().fromArray(uniform.value as number[]),
            type: '3f',
          };
          break;
        case 'uniform1fv':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1fv',
          };
          break;
        case 'uniform3fv':
          preparedUniforms[uniformName] = {
            value: (uniform.value as number[][]).map((v: number[]) =>
              new Vector3().fromArray(v)
            ),
            type: '3fv',
          };
          break;
        case 'uniform2f':
          preparedUniforms[uniformName] = {
            value: new Vector2().fromArray(uniform.value as number[]),
            type: '2f',
          };
          break;
        default:
          break;
      }
    }

    preparedUniforms.u_time = { value: 0, type: '1f' };
    preparedUniforms.u_resolution = {
      value: new Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  }, [uniforms, size.width, size.height]);

  const material = useMemo(() => {
    const materialObject = new ThreeShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms,
      glslVersion: GLSL3,
      blending: CustomBlending,
      blendSrc: SrcAlphaFactor,
      blendDst: OneFactor,
    });

    return materialObject;
  }, [source, getUniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
};

const Shader: FC<ShaderProps> = ({ source, uniforms }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
};

export const CanvasRevealEffect: FC<CanvasRevealEffectProps> = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}) => {
  return (
    <div className={cn('relative h-full w-full', containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          center={['x', 'y']}
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface CanvasRevealBackgroundProps {
  initialCanvasVisible: boolean;
  reverseCanvasVisible: boolean;
}

export const CanvasRevealBackground: FC<CanvasRevealBackgroundProps> = ({
  initialCanvasVisible,
  reverseCanvasVisible,
}) => {
  return (
    <div className="absolute inset-0 z-0">
      {initialCanvasVisible && (
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={false}
          />
        </div>
      )}

      {reverseCanvasVisible && (
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={4}
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={true}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
    </div>
  );
};
