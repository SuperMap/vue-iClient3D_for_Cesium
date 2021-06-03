/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-f2a06374', './Cartesian4-5af5bb24', './createTaskProcessorWorker', './Cartesian2-16a61632', './BoundingSphere-356f49c6', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-1e248a71', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-84e51c18', './buildModuleUrl-e7952659', './GeometryAttributes-aacecde6', './AttributeCompression-c177f997', './GeometryPipeline-963ea670', './EncodedCartesian3-a07a0929', './IndexDatatype-9435b55f', './IntersectionTests-d118a357', './Plane-29aa8f4d', './PrimitivePipeline-fae86eea', './WebMercatorProjection-9a70654e'], function (when, Check, _Math, Cartographic, Cartesian4, createTaskProcessorWorker, Cartesian2, BoundingSphere, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, PrimitivePipeline, WebMercatorProjection) { 'use strict';

    function combineGeometry(packedParameters, transferableObjects) {
        var parameters = PrimitivePipeline.PrimitivePipeline.unpackCombineGeometryParameters(packedParameters);
        var results = PrimitivePipeline.PrimitivePipeline.combineGeometry(parameters);
        return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(results, transferableObjects);
    }

    var combineGeometry$1 = createTaskProcessorWorker(combineGeometry);

    return combineGeometry$1;

});
