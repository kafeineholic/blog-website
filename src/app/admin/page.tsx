"use client";

import Link from "next/link";
import { Grid, Paper, Stack, Typography, Button, useTheme, Card, CardContent, CardActions } from "@mui/material";
import { IconEdit, IconMessage, IconPlus, IconEye } from "@tabler/icons-react";

const blogActions = [
  {
    title: 'Create Blog',
    description: 'Add a new blog post',
    href: '/admin/blogs',
    icon: IconPlus,
    color: 'primary' as const,
  },
  {
    title: 'Manage Blogs',
    description: 'Edit, publish, or delete existing blogs',
    href: '/admin/blogs',
    icon: IconEdit,
    color: 'secondary' as const,
  },
  {
    title: 'View All Blogs',
    description: 'Browse all blogs (published & drafts)',
    href: '/admin/blogs',
    icon: IconEye,
    color: 'info' as const,
  },
];

const commentActions = [
  {
    title: 'Moderate Comments',
    description: 'Approve, reject, or delete comments',
    href: '/admin/comments',
    icon: IconMessage,
    color: 'warning' as const,
  },
];

export default function AdminPage() {
  const theme = useTheme();

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: theme.colors?.ink950 }}>
          Blog Manager Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: theme.colors?.olive800 }}>
          Manage your blog content and moderate user comments
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.colors?.ink950 }}>
          Blog Management
        </Typography>
        <Grid container spacing={3}>
          {blogActions.map((action) => (
            <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{
                height: '100%',
                border: `1px solid ${theme.colors?.ink950}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows?.[4],
                }
              }}>
                <CardContent sx={{ pb: 1 }}>
                  <Stack spacing={2}>
                    <action.icon size={32} color={theme.palette[action.color]?.main} />
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
                        {action.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    component={Link}
                    href={action.href}
                    variant="contained"
                    color={action.color}
                    fullWidth
                  >
                    Go to {action.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.colors?.ink950 }}>
          Comment Moderation
        </Typography>
        <Grid container spacing={3}>
          {commentActions.map((action) => (
            <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{
                height: '100%',
                border: `1px solid ${theme.colors?.ink950}`,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows?.[4],
                }
              }}>
                <CardContent sx={{ pb: 1 }}>
                  <Stack spacing={2}>
                    <action.icon size={32} color={theme.palette[action.color]?.main} />
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors?.olive800 }}>
                        {action.description}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    component={Link}
                    href={action.href}
                    variant="contained"
                    color={action.color}
                    fullWidth
                  >
                    Go to {action.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
