/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState, useEffect } from "react";
import { ShowToastMessage } from "utils/ShowToastMessage";
// reactstrap components
import { CardBody, Container, Row, Col } from "reactstrap";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
// import network
import {
  getProjectDetailByUserAndFundId,
  getOneFundForOneUser,
} from "../../../network/ApiAxios";

import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";

import ProjectDetail from "./components/ProjectDetail";
import CardGallery from "./components/CardGallery"; // Import component CardImage
const FundInfo = ({
  userId,
  fundListForCurrentUser,
  projectComplete,
  activeProjects,
  fundId,
}) => {
  const [fundData, setFundData] = useState({});

  useEffect(() => {
    const fetchOneFundByUser = async () => {
      try {
        const response = await getOneFundForOneUser(userId, fundId);

        const { data } = response;
        console.log("🚀 ~ fetchOneFundByUser ~ data:", data);

        if (data.statusCode === 200 && data.body.id) {
          setFundData(data.body);
        } else {
          ShowToastMessage({
            title: "Get one fund data",
            message: "Quỹ không có dữ liệu",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchOneFundByUser ~ error:",
          error
        );
      }
    };
    fetchOneFundByUser();
  }, [fundId, userId]);

  return fundData ? (
    <Card sx={{ boxShadow: 3, p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sz>
          {/* Fund Image: 30% width of CardContent */}
          <Grid item size={4}>
            <Box
              component="img"
              src={fundData.logo || ""}
              alt={fundData.name_fund}
              sx={{
                objectFit: "contain",
                width: "100%", // Responsive width
                maxwidth: "200px", // Restrict the maximum width of the image
                maxHeight: "200px", // Maintain aspect ratio
                borderRadius: 2,
                margin: "0 auto", // Center the image within the grid item
                display: "block", // Ensures proper centering
              }}
            />
          </Grid>

          {/* Fund Details: 70% width of CardContent */}
          <Grid item size={8}>
            <Col>
              <Row>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {fundData.name_fund}
                </Typography>
              </Row>
              <Row>
                <Col>
                  <Typography variant="body1" color="textSecondary">
                    {fundData.description}
                  </Typography>
                </Col>

                <Col>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Ngày tạo:{" "}
                      {new Date(fundData.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Số project còn hạn: {activeProjects}
                      </Typography>
                      <Typography variant="body2">
                        Số project đã kết thúc: {projectComplete}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Email: Chưa cập nhật
                      </Typography>
                      <Typography variant="body2">
                        Địa chỉ: Chưa cập nhật
                      </Typography>
                      <Typography variant="body2">
                        Số điện thoại: Chưa cập nhật
                      </Typography>
                    </Box>
                  </Grid>
                </Col>
              </Row>
            </Col>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : null;
};

const ProjectManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [projectListForCurrentFund, setProjectListForCurrentFund] = useState(
    []
  );
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [fundListForCurrentUser, setFundListForCurrentUser] = useLocalStorage(
    "fundListForCurrentUser",
    {}
  );
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();
  const { fundId } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId"); // Lấy projectId từ query string

  useEffect(() => {
    const fetchAllProjectForCurrentFund = async () => {
      try {
        const response = await getProjectDetailByUserAndFundId(userId, fundId);

        const { data } = response;
        console.log("🚀 ~ fetchAllProjectForCurrentFund ~ data:", data);
        if (data.statusCode !== 200) {
          ShowToastMessage({
            title: "fetchAllProjectForCurrentFund",
            message: "Không thể lấy thông tin quỹ",
            type: "error",
          });
          return;
        }
        ShowToastMessage({
          title: "fetchAllProjectForCurrentFund",
          message: "Lấy thông tin quỹ thành công",
          type: "success",
        });
        setProjectListForCurrentFund(data.body);
        const now = dayjs();
        const active = data?.body.filter((project) =>
          dayjs(project.deadline).isAfter(now)
        );
        const completed = data?.body.filter((project) =>
          dayjs(project.deadline).isBefore(now)
        );

        setActiveProjects(active);
        setCompletedProjects(completed);
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
          error
        );
      }
    };
    fetchAllProjectForCurrentFund();
  }, [fundId, userId]);

  // Hàm điều hướng trở lại trang danh sách project
  const handleBackClick = () => {
    navigate(`/admin/fund-detail/${fundId}`); // Quay lại trang danh sách project
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      <HeaderCustom />

      <Container className="mt--7" fluid>
        {projectId ? (
          <div className="col">
            <ProjectDetail
              projectId={projectId}
              onBackClick={handleBackClick}
            />
          </div>
        ) : (
          <Row>
            <Box sx={{ width: "100%", padding: "20px" }}>
              <FundInfo
                userId={userId}
                fundListForCurrentUser={fundListForCurrentUser}
                projectComplete={completedProjects?.length || 0}
                activeProjects={activeProjects?.length || 0}
                fundId={fundId}
              />
            </Box>
            <Box sx={{ width: "100%", padding: "20px" }}>
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
              <Card sx={{ boxShadow: 3, p: 2 }}>
                <CardContent>
                  <Box sx={{ mt: 2, height: "fit-content" }}>
                    {selectedTab === 0 && (
                      <div style={{ padding: "20px", width: "100%" }}>
                        <CardGallery cards={activeProjects} />
                      </div>
                    )}
                    {selectedTab === 1 && (
                      <div style={{ padding: "20px", width: "100%" }}>
                        <CardGallery cards={completedProjects} />
                      </div>
                    )}
                  </Box>
                </CardContent>
              </Card>
              {/* Nội dung cho từng tab */}
            </Box>
          </Row>
        )}
      </Container>
    </>
  );
};

export default ProjectManagement;
