import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";
import { ShowToastMessage } from "utils/ShowToastMessage";
import { getAllProjects } from "../../../network/ApiAxios";
import CardImage from "components/CardImage"; // Import component CardImage

const ProjectList = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await getAllProjects();

        const { data } = response;
        console.log("🚀 ~ fetchAllProjects ~ data:", data);

        // setProjectList(data || []);
        if (data.statusCode === 200 && data.body.length > 0) {
          ShowToastMessage({
            title: "Get data",
            message: "Lấy dữ liệu thành công",
            type: "success",
          });
          const now = dayjs();
          const active = data?.body.filter((project) =>
            dayjs(project.deadline).isAfter(now)
          );
          const completed = data?.body.filter((project) =>
            dayjs(project.deadline).isBefore(now)
          );

          setActiveProjects(active);
          setCompletedProjects(completed);
        } else {
          ShowToastMessage({
            title: "Get data",
            message: "Không có dữ liệu",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllProjects ~ error:",
          error
        );
      }
    };
    fetchAllProjects();
  }, []);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      {/* Tabs cho danh sách dự án */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="project tabs"
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        <Tab label="Dự án đang gây quỹ" sx={{ fontWeight: "600" }} />
        <Tab label="Dự án đã kết thúc" sx={{ fontWeight: "600" }} />
      </Tabs>

      {/* Nội dung cho từng tab */}
      <Box sx={{ mt: 2 }}>
        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {activeProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                <CardImage {...project} />
              </Grid>
            ))}
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid container spacing={2}>
            {completedProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                <CardImage {...project} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProjectList;
