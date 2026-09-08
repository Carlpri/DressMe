import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { usePublicOutfits } from "../../hooks/useOutfits";
import type { Outfit } from "../../hooks/useOutfits";
import { OutfitCard } from "../shared/OutfitCard";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const DEEP_EMERALD = "#166534";

export function CommunityOutfitsSection() {
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 70 });
  const { data: outfits, isLoading } = usePublicOutfits();
  const visibleOutfits = outfits?.slice(0, 4) ?? [];

  if (!isLoading && visibleOutfits.length === 0) return null;

  return (
    <Box ref={sectionRef} sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <AutoAwesomeRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 20 }} />
              <Typography sx={{ color: DEEP_EMERALD, fontWeight: 800, fontSize: "0.76rem", letterSpacing: "0.14em" }}>
                COMMUNITY LOOKS
              </Typography>
            </Stack>
            <Typography variant="h2" className="font-display" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.1 }}>
              Styled by the DressMe community
            </Typography>
            <Typography sx={{ mt: 1, color: "#64748B", maxWidth: 600 }}>
              Discover complete looks assembled from pieces you can shop right now.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {Array.from({ length: isLoading ? 4 : visibleOutfits.length }).map((_, index) => {
              const outfit: Outfit | undefined = isLoading ? undefined : visibleOutfits[index];
              return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={outfit?.id ?? index} className="reveal-child">
                {outfit ? <OutfitCard outfit={outfit} /> : <Box sx={{ height: 420, borderRadius: 3, bgcolor: "#E2E8F0", animation: "heroCardPulse 1.6s ease-in-out infinite" }} />}
              </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
