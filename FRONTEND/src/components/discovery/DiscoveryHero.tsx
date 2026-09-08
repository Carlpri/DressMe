import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ROUTES } from "../../constants/routes";

const MotionBox = motion(Box);
const HERO_VIDEO = "/STREET%201.mp4";
const HERO_POSTER = "/nairobi-streetwear.jpg";

const textVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function DiscoveryHero({ onExploreClick }: { onExploreClick?: () => void }) {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <Box
      ref={heroRef}
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: "78svh", md: "min(860px, 88svh)" },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        bgcolor: "#172018",
        isolation: "isolate",
      }}
    >
      <MotionBox
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: "-8% 0",
          zIndex: -2,
          backgroundImage: `url(${HERO_POSTER})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        style={{ y: reducedMotion ? 0 : imageY }}
      >
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          src={HERO_VIDEO}
          aria-label="DressMe fashion discovery"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: 1,
            filter: "contrast(1.08) saturate(1.06) brightness(1.02)",
            imageRendering: "high-quality",
            animation: reducedMotion ? "none" : "heroVideoZoom 18s ease-in-out infinite",
          }}
        />
      </MotionBox>

      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: {
            xs: "linear-gradient(180deg, rgba(7, 12, 9, 0.18) 12%, rgba(7, 12, 9, 0.42) 46%, rgba(7, 12, 9, 0.92) 100%)",
            md: "linear-gradient(90deg, rgba(7, 12, 9, 0.9) 0%, rgba(7, 12, 9, 0.64) 38%, rgba(7, 12, 9, 0.18) 72%, rgba(7, 12, 9, 0.08) 100%)",
          },
        }}
      />

      <Container maxWidth="xl" sx={{ pb: { xs: 5, sm: 7, md: 10 }, position: "relative" }}>
        <Stack
          spacing={{ xs: 2, md: 2.5 }}
          sx={{
            maxWidth: { xs: 440, md: 690 },
            color: "#FFFFFF",
            textShadow: "0 2px 18px rgba(0, 0, 0, 0.42)",
          }}
        >
          <MotionBox
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={0.08}
            sx={{
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              lineHeight: 1.4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            AFRICAN FASHION-TECH DISCOVERY
          </MotionBox>

          <MotionBox variants={textVariants} initial="hidden" animate="visible" custom={0.2}>
            <Typography
              component="h1"
              className="font-display"
              sx={{
                fontSize: { xs: "3.7rem", sm: "5.6rem", md: "7.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.055em",
                lineHeight: { xs: 0.94, md: 0.88 },
                maxWidth: 680,
              }}
            >
              Find your style.
            </Typography>
          </MotionBox>

          <MotionBox variants={textVariants} initial="hidden" animate="visible" custom={0.32}>
            <Typography
              sx={{
                maxWidth: 500,
                color: "rgba(255,255,255,0.94)",
                fontSize: { xs: "0.98rem", md: "1.1rem" },
                lineHeight: 1.55,
              }}
            >
              Curated looks, streetwear, and designer staples from Kenya&apos;s top fashion creators.
            </Typography>
          </MotionBox>

          <MotionBox variants={textVariants} initial="hidden" animate="visible" custom={0.44}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                onClick={onExploreClick}
                endIcon={<ArrowDownwardRoundedIcon />}
                sx={{
                  px: 2.5,
                  py: 1.35,
                  borderRadius: 1.5,
                  bgcolor: "#FFFFFF",
                  color: "#132018",
                  fontWeight: 800,
                  textShadow: "none",
                  minHeight: 52,
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
                  "&:hover": { bgcolor: "#E8F5E9", boxShadow: "0 10px 28px rgba(0, 0, 0, 0.3)" },
                }}
              >
                Explore fashion
              </Button>
              <Button
                variant="text"
                onClick={() => navigate(ROUTES.aiStylist)}
                startIcon={<AutoAwesomeRoundedIcon />}
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  textShadow: "0 2px 12px rgba(0, 0, 0, 0.5)",
                  minHeight: 48,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                }}
              >
                Find my style
              </Button>
            </Stack>
          </MotionBox>
        </Stack>
      </Container>

      <Typography
        sx={{
          position: "absolute",
          right: { xs: 2, md: 5 },
          bottom: { xs: 4, md: 7 },
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
        }}
      >
        DressMe / Nairobi
      </Typography>
    </Box>
  );
}
