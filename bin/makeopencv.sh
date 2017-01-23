mkdir -p build
cd build
cmake \
  -D CMAKE_BUILD_TYPE=RELEASE\
  -D CMAKE_INSTALL_PREFIX=/usr/local\
  -D WITH_FFMPEG=OFF\
  -D WITH_CUDA=OFF\
  -D WITH_CUFFT=OFF\
  -D WITH_CUBLAS=OFF\
  -D WITH_NVCUVID=OFF\
  -D INSTALL_C_EXAMPLES=OFF\
  -D INSTALL_PYTHON_EXAMPLES=ON\
  -D BUILD_SHARED_LIBS=OFF\
  ..


  # -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
  # -D BUILD_EXAMPLES=ON 
  # -D PYTHON_LIBRARY=/usr/lib/x86_64-linux-gnu/libpython3.4m.so     \
  # -D PYTHON_INCLUDE_DIR=/usr/include/python3.4m     \
  # -D PYTHON_INCLUDE_DIR2=/usr/include/x86_64-linux-gnu/python3.4m     .\
