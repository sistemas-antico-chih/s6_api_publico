'use strict';
// MongoDB
var _ = require('underscore');
var { contrataciones } = require('../utils/models');
var ObjectId = require('mongoose').Types.ObjectId;

function diacriticSensitiveRegex(string = '') {
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return string.replace(/a/g, '[a,á,à,ä]')
        .replace(/e/g, '[e,é,ë]')
        .replace(/i/g, '[i,í,ï]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/A/g, '[a,á,à,ä]')
        .replace(/E/g, '[e,é,ë]')
        .replace(/I/g, '[i,í,ï]')
        .replace(/O/g, '[o,ó,ö,ò]')
        .replace(/U/g, '[u,ü,ú,ù]')
}

async function getDependencias () {
    let dependencias = await contrataciones.find({ 'buyer.name': { $exists: true } }).distinct('buyer.name').exec();
    return dependencias;
}


async function post_contrataciones(body) {
    let sortObj = body.sort === undefined ? {} : body.sort;
    let page = body.page;  //numero de papostgina a mostrar
    let pageSize = body.pageSize;
    let query = body.query === undefined ? {} : body.query;

    if (pageSize <= 0) { pageSize = 10; }
    if (pageSize > 200) { pageSize = 200; }

    let select = {
        '_id': 0
    }

    if (page <= 0) {
        throw new RangeError("Error campo page fuera de rango");
    } else {
        let newQuery = {};
        let newSort = {};

        for (let [key, value] of Object.entries(sortObj)) {
            if (key === "institucion") {
                newSort["buyer.name"] = value
            }
            if (key === "contratacion") {
                newSort["tender.procurementMethod"] = value
            }
            if (key === "ciclo") {
                newSort["cycle"] = value
            }
            if (key === "proveedor") {
                newSort["awards.suppliers.name"] = value
            }
            if (key === "frase") {
                newSort["tender.title"] = value
            }

            for (let [key, value] of Object.entries(query)) {
                if (key === "id") {
                    if ((value.trim().length || 0) > 0) {
                        if (ObjectId.isValid(value)) {
                            newQuery["_id"] = value;
                        } else {
                            newQuery["_id"] = null;
                        }
                    }
                }
                //institucion
                else if (key === "institucion") {
                    newQuery["buyer.name"] = { $regex: diacriticSensitiveRegex(value), $options: 'i' }
                }

                //tipo contratacion
                else if (key === "contratacion") {
                    newQuery["tender.procurementMethod"] = { $regex: diacriticSensitiveRegex(value), $options: 'i' }
                }

                //ciclo
                else if (key === "ciclo") {
                    newQuery["cycle"] = { $regex: diacriticSensitiveRegex(value), $options: 'i' }
                }

                //proveedor
                else if (key === "proveedor") {
                    newQuery = {
                        $or: [
                            { 'awards.0.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.1.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.2.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.3.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.4.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.5.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.6.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.7.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.8.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.9.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.10.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.11.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.12.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.13.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.14.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.15.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.16.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.17.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.18.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.19.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.20.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                            { 'awards.21.suppliers.0.name': { $regex: diacriticSensitiveRegex(value), $options: 'i' } },
                        ]
                    };
                }

                //frase busqueda
                else if (key === "frase") {
                    newQuery["tender.title"] = { $regex: diacriticSensitiveRegex(value), $options: 'i' }
                }
                console.log(newQuery);
                if (pageSize <= 200 && pageSize >= 1) {
                    let paginationResult = await contrataciones.paginate(newQuery, { page: page, limit: pageSize, sort: newSort }).then();
                    let objpagination = { hasNextPage: paginationResult.hasNextPage, page: paginationResult.page, pageSize: paginationResult.limit, totalRows: paginationResult.totalDocs }
                    let objresults = paginationResult.docs;

                    console.log(objresults);

                    try {
                        var strippedRows = _.map(objresults, function (row) {
                            let rowExtend = _.extend({ id: row._id }, row.toObject());
                            console.log(rowExtend);

                            return _.omit(rowExtend, '_id');
                        });
                    } catch (e) {
                        console.log(e);
                    }

                    console.log(strippedRows);

                    let objResponse = {};
                    objResponse["pagination"] = objpagination;
                    objResponse["results"] = strippedRows;
                    return objResponse;

                } else {
                    throw new RangeError("Error campo pageSize fuera de rango, el rango del campo es 1..200 ");
                }
            }
        }
        module.exports.post_contrataciones = post_contrataciones;
        module.exports.getDependencias = getDependencias;
